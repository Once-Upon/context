import {
  Transaction,
  EventLogTopics,
  SkyoneerContextActionEnum,
  AssetType,
} from '../../../types';
import { GAME_ENGINE_CONTRACT_ADDRESS, GAME_ENGINE_ABI } from './constants';
import { decodeLog } from '../../../helpers/utils';

export function contextualize(transaction: Transaction): Transaction {
  const isGameEngine = detect(transaction);
  if (!isGameEngine) return transaction;

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
    if (log.address !== GAME_ENGINE_CONTRACT_ADDRESS) continue;

    const decoded = decodeLog(GAME_ENGINE_ABI, log.data, [
      log.topic0,
      log.topic1,
      log.topic2,
      log.topic3,
    ] as EventLogTopics);

    if (decoded && decoded.eventName === 'SentTokenToAnotherUser') {
      return true;
    }
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.logs || !transaction.chainId) return transaction;

  let decoded;
  for (const log of transaction.logs) {
    if (log.address !== GAME_ENGINE_CONTRACT_ADDRESS) continue;

    decoded = decodeLog(GAME_ENGINE_ABI, log.data, [
      log.topic0,
      log.topic1,
      log.topic2,
      log.topic3,
    ] as EventLogTopics);

    if (decoded && decoded.eventName === 'SentTokenToAnotherUser') {
      break;
    }
  }
  if (!decoded) return transaction;

  // grab variables from decoded event
  const sender = decoded.args['sender'] as string;
  const receiver = decoded.args['receiver'] as string;
  const tokenAddress = decoded.args['tokenAddress'] as string;
  const tokenAmount = decoded.args['tokenAmount'];

  transaction.context = {
    summaries: {
      category: 'PROTOCOL_1',
      en: {
        title: `Skyoneer`,
        default: '[[sender]][[contextAction]][[token]][[receiver]]',
      },
    },
    variables: {
      sender: {
        type: 'address',
        value: sender,
      },
      receiver: {
        type: 'address',
        value: receiver,
      },
      token: {
        type: AssetType.ERC20,
        token: tokenAddress,
        value: tokenAmount.toString(),
      },
      contextAction: {
        type: 'contextAction',
        value: SkyoneerContextActionEnum.TRANSFERRED,
      },
    },
  };

  return transaction;
}
