import { formatEther, parseEther, Hex, Abi } from 'viem';
import {
  AssetType,
  EventLogTopics,
  HeuristicContextActionEnum,
  HeuristicPrefix,
  Transaction,
} from '../../../types';
import { HOP_TRANSFER_SENT_EVENT_ABI, HOP_RELAYERS } from './constants';
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
  const transferSentLog = logs.find((log: any) => {
    if (log.address !== HOP_RELAYERS[originChainId]) return false;

    const decoded = decodeLog(
      HOP_TRANSFER_SENT_EVENT_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) return false;

    if (decoded.eventName === 'TransferSent') return true;
  });
  if (transferSentLog) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  const originChainId = transaction.chainId ?? 1;
  const logs = transaction.logs ?? [];
  let decodedTransferSentLog;
  for (const log of logs) {
    if (log.address !== HOP_RELAYERS[originChainId]) continue;

    const decoded = decodeLog(
      HOP_TRANSFER_SENT_EVENT_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) continue;

    if (decoded.eventName === 'TransferSent') {
      decodedTransferSentLog = decoded;
      break;
    }
  }

  if (!decodedTransferSentLog) return transaction;

  const destinationChainId = decodedTransferSentLog.args['chainId'] as bigint;
  const amount = formatEther(decodedTransferSentLog.args['amount'] as bigint);

  transaction.context = {
    actions: [
      HeuristicContextActionEnum.BRIDGED,
      `${HeuristicPrefix}.${HeuristicContextActionEnum.BRIDGED}`,
    ],

    summaries: {
      category: 'MULTICHAIN',
      en: {
        title: `Bridge`,
        default: '[[subject]][[bridged]][[amount]]to[[chainID]]',
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
        value: Number(destinationChainId),
      },
      bridged: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.BRIDGED,
        value: HeuristicContextActionEnum.BRIDGED,
      },
    },
  };

  return transaction;
}
