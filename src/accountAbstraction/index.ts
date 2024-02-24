import { Hex } from 'viem';
import { Transaction } from '../types';
import { ENTRY_POINT, ABIs } from './constants';
import { decodeTransactionInput } from '../helpers/utils';

const accountExecutionDecoders = [];

export const unpackERC4337Transactions = (
  transaction: Transaction,
): Transaction[] => {
  if (!transaction.to || transaction.to !== ENTRY_POINT) {
    return [transaction];
  }

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    ABIs.EntryPoint,
  );
  if (!decoded) return [transaction];

  if (decoded.functionName === 'handleOps') {
    const [userOps, benficiary] = decoded.args;

    const bundler = transaction.from;

    const result = userOps.map((v) => {
      const userOpData = {
        maxFeePerGas: v.maxFeePerGas.toString(),
        maxPriorityFeePerGas: v.maxPriorityFeePerGas.toString(),
        from: v.sender.toLowerCase(),
        data: v.callData,
        input: v.callData,
      };

      let { decode, assetTransfers, logs, ...rest } = transaction;

      // Remove asset transfer of eth from entry point to bundler
      assetTransfers = assetTransfers?.filter((transfer) => {
        return !(
          transfer.type === 'eth' &&
          transfer.from === ENTRY_POINT &&
          transfer.to === benficiary.toLowerCase()
        );
      });

      // Remove entry point logs
      logs = logs?.filter((log) => {
        log.address !== ENTRY_POINT;
      });

      const intermediateTxn = {
        ...rest,
        assetTransfers,
        logs,
        ...userOpData,
        isERC4337Transaction: true,
        ERC4337Info: {
          bundler,
          entryPoint: ENTRY_POINT,
        },
      };

      for (const decoder of accountExecutionDecoders) {
        const result = decoder(intermediateTxn);
        if (result) {
          return { ...intermediateTxn, ...result };
        }
      }

      return transaction;
    });

    return result;
  }

  if (decoded.functionName !== 'handleAggregatedOps') {
    // TODO implement
  }

  return [transaction];
};
