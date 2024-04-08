import { decodeEventLog, decodeFunctionData, Hex } from 'viem';
import type {
  EventLogTopics,
  PartialTransaction,
  PseudoTransaction,
  RawReceipt,
  RawLog,
  RawTrace,
} from '../../../types';
import { isRawTransaction, type TxnTransformer } from '../../../helpers/utils';
import { decodeTransactionInput } from '../../../helpers/utils';

import { getUserOpHash } from './utils';
import { decode as simpleAccountDecode } from './accounts/simpleAccount';
import { decode as unknownDecode } from './accounts/unknown';
import { decode as okxDecode } from './accounts/okx';
import { decode as flashWalletDecode } from './accounts/flashWallet';

import { ENTRY_POINT_V060, ABIs } from './constants';

const accountExecutionDecoders = [
  simpleAccountDecode,
  unknownDecode,
  okxDecode,
  flashWalletDecode,
];

// TODO replace with non-generator impls? so that we don't have to Array.from all the time
function* takeWhile<T>(xs: T[], fn: (v: T) => boolean) {
  for (let x of xs)
    if (fn(x)) yield x;
    else break;
}

function* dropWhile<T>(xs: T[], fn: (v: T) => boolean) {
  let dropping = true;
  for (let x of xs) {
    if (dropping && fn(x)) {
      continue;
    } else {
      dropping = false;
      yield x;
    }
  }
}

// Filter out the relevant logs for the user op hash from the full transaction logs by:
// 1. Removing everything up until `BeforeExecution` and everything after the last `UserOperationEvent`
// 2. Reversing the list
// 3. Finding the `UserOperationEvent` for the current userOp
// 4. Taking all logs until the next `UserOperationEvent`
//
// NOTE: we need to handle events that don't conform to the EntryPoint
// ABI here since the UserOp can emit arbitrary events
const filterOutUserOpLogs = (logs: RawLog[], userOpHash: string) => {
  const parsedLogs = logs.map((log) => {
    try {
      const { data, topics } = log;
      return {
        parsed: true,
        log,
        decoded: decodeEventLog({
          abi: ABIs.EntryPointV060,
          data: data as Hex,
          topics: topics as EventLogTopics,
        }),
      };
    } catch (_) {
      return { parsed: false, log };
    }
  });
  const [_, ...clearBefore] = dropWhile(
    parsedLogs,
    (x) => !x.parsed || x.decoded?.eventName !== 'BeforeExecution',
  );
  const trimmedReversed = dropWhile(
    clearBefore.reverse(),
    (x) => !x.parsed || x.decoded?.eventName !== 'UserOperationEvent',
  );
  const opStart = dropWhile(
    Array.from(trimmedReversed),
    (x) =>
      !x.parsed ||
      x.decoded?.eventName !== 'UserOperationEvent' ||
      x.decoded?.args.userOpHash !== userOpHash,
  );
  return Array.from(
    takeWhile(
      Array.from(opStart),
      (x) =>
        !x.parsed ||
        x.decoded?.eventName !== 'UserOperationEvent' ||
        x.decoded?.args.userOpHash === userOpHash,
    ),
  ).reverse();
};

// Filter out traces for the user op from the full transaction traces by
// finding the trace { from: entrypoint, to: entrypoint }
// where the decoded input argument userOpInfo.hash matches, and then take
// all subtraces by comparing traceAddress
const filterOutUserOpTraces = (traces: RawTrace[], userOpHash: string) => {
  const opEntryTrace = traces
    .filter(
      ({ action }) =>
        action.from === ENTRY_POINT_V060 && action.to === ENTRY_POINT_V060,
    )
    .find((v) => {
      const decoded = decodeFunctionData({
        abi: ABIs.EntryPointV060,
        data: v.action.input as Hex,
      });

      if (decoded.functionName !== 'innerHandleOp') return false;

      return decoded.args[1].userOpHash == userOpHash;
    });

  if (!opEntryTrace) return [];

  return traces.filter((v) => {
    for (const [idx, addr] of opEntryTrace.traceAddress.entries()) {
      if (v.traceAddress[idx] !== addr) return false;
    }

    return true;
  });
};

const isPresent = <T>(t: T | undefined | null): t is T =>
  t !== undefined && t !== null;

export const unpackERC4337Transactions = (
  transaction: PartialTransaction,
): PseudoTransaction[] => {
  if (
    !transaction.to ||
    transaction.to !== ENTRY_POINT_V060 ||
    transaction.chainId === undefined ||
    !isRawTransaction(transaction)
  ) {
    return [];
  }

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    ABIs.EntryPointV060,
  );

  if (!decoded) return [];

  if (decoded.functionName === 'handleOps') {
    const [userOps, benficiary] = decoded.args;

    const bundler = transaction.from;

    const result = userOps
      .flatMap((v) => {
        const hash = getUserOpHash(v, transaction.chainId!);

        const userOpData = {
          maxFeePerGas: v.maxFeePerGas,
          maxPriorityFeePerGas: v.maxPriorityFeePerGas,
          from: v.sender.toLowerCase() as Hex,
          data: v.callData,
          input: v.callData,
        };

        let { hash: _hash, receipt, traces, ...rest } = transaction;

        const [first, ...reversedLogs] = filterOutUserOpLogs(
          receipt.logs,
          hash,
        ).reverse();
        const otherLogs = reversedLogs.reverse();
        const resultEvent =
          first.decoded?.eventName === 'UserOperationEvent'
            ? first.decoded
            : undefined;

        let userOpReceipt: RawReceipt = {
          status: resultEvent?.args.success ? 1 : 0,
          logs: otherLogs.map(({ log }) => log),
          gasUsed: 0,
          effectiveGasPrice: 0,
        };

        if (resultEvent?.args.actualGasUsed) {
          userOpReceipt.gasUsed = Number(resultEvent?.args.actualGasUsed);
        }

        if (resultEvent?.args.actualGasCost) {
          userOpReceipt.effectiveGasPrice = Number(
            resultEvent?.args.actualGasCost,
          );
        }

        const opTraces = filterOutUserOpTraces(traces, hash);

        const intermediateTxn = {
          ...rest,
          ...userOpData,
          userOpHash: hash,
          traces: opTraces,
          receipt: userOpReceipt,
          meta: {
            key: hash,
            type: 'ERC4337' as const,
            bundler,
            benficiary: benficiary.toLowerCase() as Hex,
            entryPoint: ENTRY_POINT_V060,
          },
        };

        for (const decoder of accountExecutionDecoders) {
          const result = decoder(intermediateTxn);
          if (result?.length) {
            return result.map((r) => ({
              ...intermediateTxn,
              ...r,
              to: r.to.toLowerCase() as Hex,
            }));
          }
        }
      })
      .filter(isPresent);

    return result;
  }

  if (decoded.functionName !== 'handleAggregatedOps') {
    // TODO implement once this starts being used
    //
    // ```sql
    // select * from erc4337_ethereum.EntryPoint_v0_6_call_handleAggregatedOps;
    // ```
    // returns 0 rows on dune as of today
  }

  return [];
};

export const transform: TxnTransformer = (_block, tx) => {
  if (!isRawTransaction(tx)) return tx;

  const pseudoTransactions = unpackERC4337Transactions(tx);

  return { ...tx, pseudoTransactions };
};
