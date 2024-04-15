import { formatEther, parseEther, Hex, Abi } from 'viem';
import {
  AssetType,
  EventLogTopics,
  HeuristicContextActionEnum,
  Transaction,
} from '../../../types';
import {
  HOP_TRANSFER_FROM_L1_COMPLETED_EVENT_ABI,
  HOP_RELAYERS,
} from './constants';
import { decodeLog } from '../../../helpers/utils';

export function contextualize(transaction: Transaction): Transaction {
  const isHopTransferToL1 = detect(transaction);
  if (!isHopTransferToL1) return transaction;

  const result = generate(transaction);
  return result;
}

export function detect(transaction: Transaction): boolean {
  /**
   * There is a degree of overlap between the 'detect' and 'generateContext' functions,
   *  and while this might seem redundant, maintaining the 'detect' function aligns with
   * established patterns in our other modules. This consistency is beneficial,
   * and it also serves to decouple the logic, thereby simplifying the testing process
   */
  const originChainId = transaction.chainId ?? 1;
  const logs = transaction.logs ?? [];
  const transferFromL1CompletedLog = logs.find((log: any) => {
    if (log.address !== HOP_RELAYERS[originChainId]) return false;

    const decoded = decodeLog(
      HOP_TRANSFER_FROM_L1_COMPLETED_EVENT_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) return false;

    if (decoded.eventName === 'TransferFromL1Completed') return true;
  });
  if (transferFromL1CompletedLog) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  const chainId = transaction.chainId;
  if (!chainId) return transaction;

  const logs = transaction.logs ?? [];
  let decodedTransferFromL1CompletedLog;
  for (const log of logs) {
    if (log.address !== HOP_RELAYERS[chainId]) continue;

    const decoded = decodeLog(
      HOP_TRANSFER_FROM_L1_COMPLETED_EVENT_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) continue;

    if (decoded.eventName === 'TransferFromL1Completed') {
      decodedTransferFromL1CompletedLog = decoded;
      break;
    }
  }

  if (!decodedTransferFromL1CompletedLog) return transaction;

  const sourceChainId = 1;
  const amount = formatEther(
    decodedTransferFromL1CompletedLog.args['amount'] as bigint,
  );

  transaction.context = {
    summaries: {
      category: 'MULTICHAIN',
      en: {
        title: `Bridge`,
        default: '[[subject]][[bridged]][[amount]]from[[chainID]]',
      },
    },
    variables: {
      subject: {
        type: 'address',
        value: transaction.from,
      },
      amount: {
        type: AssetType.ETH,
        value: parseEther(amount).toString(),
        unit: 'wei',
      },
      chainID: {
        type: 'chainID',
        value: Number(sourceChainId),
      },
      bridged: {
        type: 'contextAction',
        value: HeuristicContextActionEnum.BRIDGED,
      },
    },
  };

  return transaction;
}
