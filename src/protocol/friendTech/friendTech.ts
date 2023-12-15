import { Transaction } from '../../types';
import { FriendTech, FRIEND_TECH_ADDRESSES} from './constants.ts';

export const contextualize = (transaction: Transaction): Transaction => {
  const isFriendTech = detect(transaction);
  if (!isFriendTech) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  /** implement your detection logic */
  if (!transaction.value) {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  /** implement your context generation logic */
  transaction.context = {
    variables: {
      contextAction: {
        type: 'contextAction',
        value: '<ACTION_TEXT>', // text should be SCREAMING_SNAKE_CASE e.g. PURCHASED
      },
      subject: {
        type: '<TYPE>', // e.g. 'address'
        value: '', // e.g. '0xabc...123'
      },
      asset1: {
        type: '<TYPE>', // e.g. 'erc20'
        value: '',
      },
      asset2: {
        type: '',
        value: '',
      },
      userCount: {
        type: 'emphasis',
        value: '70',
      },
    },
    summaries: {
      category: 'PROTOCOL_1', // can be 1-5, with 1 being the "most important"
      en: {
        title: '<Name of protocol>', // e.g. Farcaster
        variables: {
        },
        default:
          '[[subject]] [[contextAction]] [[asset1]] for [[asset2]] [[userCount]] users',
      },
    },
  };

  return transaction;
};
