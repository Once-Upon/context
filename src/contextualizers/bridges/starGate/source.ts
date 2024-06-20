import { formatEther, parseEther, Hex, Abi } from 'viem';
import {
  AssetType,
  EventLogTopics,
  HeuristicContextActionEnum,
  Log,
  Transaction,
} from '../../../types';
import {
  STAR_GATE_BRIDGES,
  STAR_GATE_SEND_MSG_EVENT_ABI,
  STAR_GATE_POOLS,
  STAR_GATE_SWAP_EVENT_ABI,
  STAR_GATE_RELAYERS,
  STAR_GATE_PACKET_EVENT_ABI,
  STAR_GATE_CHAIN_IDS,
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
  const sendMsgLog = logs.find((log: Log) => {
    if (log.address !== STAR_GATE_BRIDGES[originChainId]) return false;
    const decoded = decodeLog(
      STAR_GATE_SEND_MSG_EVENT_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) return false;

    if (decoded.eventName === 'SendMsg') return true;
  });
  const packetLog = logs.find((log: Log) => {
    if (log.address !== STAR_GATE_RELAYERS[originChainId]) return false;

    const decoded = decodeLog(
      STAR_GATE_PACKET_EVENT_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) return false;

    if (decoded.eventName === 'Packet') return true;
  });
  const swapLog = logs.find((log: Log) => {
    if (log.address !== STAR_GATE_POOLS[originChainId]) return false;

    const decoded = decodeLog(
      STAR_GATE_SWAP_EVENT_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) return false;

    if (decoded.eventName === 'Swap') return true;
  });

  if (sendMsgLog && packetLog && swapLog) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  const originChainId = transaction.chainId ?? 1;
  const logs = transaction.logs ?? [];
  let decodedSwapLog;

  for (const log of logs) {
    if (log.address !== STAR_GATE_POOLS[originChainId]) continue;

    const decoded = decodeLog(
      STAR_GATE_SWAP_EVENT_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) continue;

    if (decoded.eventName === 'Swap') {
      decodedSwapLog = decoded;
      break;
    }
  }

  if (!decodedSwapLog) return transaction;

  const destinationChainId = Number(decodedSwapLog.args['chainId'] as bigint);
  if (!STAR_GATE_CHAIN_IDS[destinationChainId]) return transaction;

  const amount = formatEther(decodedSwapLog.args['amountSD'] as bigint);

  transaction.context = {
    actions: [HeuristicContextActionEnum.BRIDGED],

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
        value: STAR_GATE_CHAIN_IDS[destinationChainId],
      },
      bridged: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.BRIDGED,
        value: HeuristicContextActionEnum.BRIDGED,
      },
    },

    summaries: {
      category: 'MULTICHAIN',
      en: {
        title: `Bridge`,
        default: '[[subject]][[bridged]][[amount]]to[[chainID]]',
      },
    },
  };

  return transaction;
}
