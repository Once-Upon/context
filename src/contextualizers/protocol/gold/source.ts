import {
  Transaction,
  EventLogTopics,
  GoldContextActionEnum,
  Protocols,
  ProtocolMap,
} from '../../../types';
import {
  PACK_ACTIVATION_SOURCE_CONTRACT,
  PACK_ACTIVATION_SOURCE_ABI,
} from './constants';
import { decodeLog } from '../../../helpers/utils';

export function contextualize(transaction: Transaction): Transaction {
  const isPackActivationSource = detect(transaction);
  if (!isPackActivationSource) return transaction;

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
  // check logs
  if (!transaction.logs) return false;

  for (const log of transaction.logs) {
    if (log.address !== PACK_ACTIVATION_SOURCE_CONTRACT) continue;

    const decoded = decodeLog(PACK_ACTIVATION_SOURCE_ABI, log.data, [
      log.topic0,
      log.topic1,
      log.topic2,
      log.topic3,
    ] as EventLogTopics);

    if (decoded && decoded.eventName === 'ActivatedStarterPackOnSource') {
      return true;
    }
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.logs || !transaction.chainId) return transaction;

  // decode ActivatedStarterPackOnSource event
  let decoded;
  for (const log of transaction.logs) {
    if (log.address !== PACK_ACTIVATION_SOURCE_CONTRACT) continue;

    decoded = decodeLog(PACK_ACTIVATION_SOURCE_ABI, log.data, [
      log.topic0,
      log.topic1,
      log.topic2,
      log.topic3,
    ] as EventLogTopics);

    if (decoded && decoded.eventName === 'ActivatedStarterPackOnSource') {
      break;
    }
  }
  if (!decoded) return transaction;

  // grab variables from decoded event
  const activator = decoded.args['activator'];

  transaction.context = {
    summaries: {
      category: 'PROTOCOL_1',
      en: {
        title: ProtocolMap[Protocols.GOLD],
        default: '[[activator]][[activated]]',
      },
    },
    variables: {
      activator: {
        type: 'address',
        value: activator,
      },
      activated: {
        type: 'contextAction',
        id: `${Protocols.GOLD}.${GoldContextActionEnum.ACTIVATED_A_STARTER_PACK}`,
        value: GoldContextActionEnum.ACTIVATED_A_STARTER_PACK,
      },
    },
  };

  return transaction;
}
