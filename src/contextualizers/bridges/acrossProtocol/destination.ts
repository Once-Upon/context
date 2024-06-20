import { formatEther, parseEther, Hex, Abi } from 'viem';
import {
  AssetType,
  EventLogTopics,
  Transaction,
  HeuristicContextActionEnum,
  Log,
} from '../../../types';
import {
  ACROSS_PROTOCOL_RELAYER_ABI,
  ACROSS_PROTOCOL_RELAYERS,
} from './constants';
import { decodeLog } from '../../../helpers/utils';

export function contextualize(transaction: Transaction): Transaction {
  const isAcrossProtocol = detect(transaction);
  if (!isAcrossProtocol) return transaction;

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
  const filledRelayLog = logs.find((log: Log) => {
    if (log.address !== ACROSS_PROTOCOL_RELAYERS[originChainId]) return false;

    const decoded = decodeLog(
      ACROSS_PROTOCOL_RELAYER_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) return false;

    if (decoded.eventName === 'FilledRelay') return true;
  });
  if (filledRelayLog) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  const originChainId = transaction.chainId ?? 1;
  const logs = transaction.logs ?? [];
  let filledRelayEvent;
  const filledRelayLog = logs.find((log: Log) => {
    if (log.address !== ACROSS_PROTOCOL_RELAYERS[originChainId]) return false;

    const decoded = decodeLog(
      ACROSS_PROTOCOL_RELAYER_ABI as Abi,
      log.data as Hex,
      [log.topic0, log.topic1, log.topic2, log.topic3] as EventLogTopics,
    );
    if (!decoded) return false;

    if (decoded.eventName === 'FilledRelay') {
      filledRelayEvent = decoded;
      return true;
    }
  });

  if (!filledRelayLog) return transaction;

  const chainId = Number(filledRelayEvent.args['originChainId'] as bigint);
  const amount = formatEther(filledRelayEvent.args['amount'] as bigint);
  transaction.context = {
    actions: [HeuristicContextActionEnum.BRIDGED],

    summaries: {
      category: 'MULTICHAIN',
      en: {
        title: `Bridge`,
        default: '[[subject]][[bridged]][[amount]]from[[originChainId]]',
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
      originChainId: {
        type: 'chainID',
        value: chainId,
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
