import { formatEther, parseEther, Hex, Abi } from 'viem';
import {
  AssetType,
  EventLogTopics,
  HeuristicContextActionEnum,
  Log,
  Transaction,
} from '../../../types';
import {
  STAR_GATE_RELAYERS,
  STAR_GATE_PACKET_RECEIVED_EVENT_ABI,
} from './constants';
import { decodeLog } from '../../../helpers/utils';

export function contextualize(transaction: Transaction): Transaction {
  const isStarGate = detect(transaction);
  if (!isStarGate) return transaction;

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

  const packetReceivedLog = logs.find((log: Log) => {
    if (log.address !== STAR_GATE_RELAYERS[originChainId]) return false;

    const decoded = decodeLog(
      STAR_GATE_PACKET_RECEIVED_EVENT_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) return false;

    if (decoded.eventName === 'PacketReceived') return true;
  });

  if (packetReceivedLog) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  const originChainId = transaction.chainId ?? 1;
  const logs = transaction.logs ?? [];
  let decodedPacketReceivedLog;

  for (const log of logs) {
    if (log.address !== STAR_GATE_RELAYERS[originChainId]) continue;

    const decoded = decodeLog(
      STAR_GATE_PACKET_RECEIVED_EVENT_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) continue;

    if (decoded.eventName === 'PacketReceived') {
      decodedPacketReceivedLog = decoded;
      break;
    }
  }

  if (decodedPacketReceivedLog) {
    const sourceChainId = Number(
      decodedPacketReceivedLog.args['srcChainId'] as bigint,
    );
    const amount = formatEther(
      decodedPacketReceivedLog.args['amountSD'] as bigint,
    );

    transaction.context = {
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
          value: sourceChainId,
        },
        bridged: {
          type: 'contextAction',
          value: HeuristicContextActionEnum.BRIDGED,
        },
      },
      summaries: {
        category: 'MULTICHAIN',
        en: {
          title: `Bridge`,
          default: '[[subject]][[bridged]][[amount]]from[[chainID]]',
        },
      },
    };
  }
  return transaction;
}
