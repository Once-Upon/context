import { Hex } from 'viem';
import { EventLogTopics, Transaction } from '../../types';
import { ABIs, FRIEND_TECH_ADDRESSES } from './constants';
import { decodeTransactionInput, decodeLog } from '../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isFriendTech = detect(transaction);
  if (!isFriendTech) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  /** implement your detection logic */
  if (transaction.to !== FRIEND_TECH_ADDRESSES || !transaction.logs) {
    return false;
  }
  // buyShares(address sharesSubject, uint256 amount)
  if (transaction.sigHash === '0x6945b123') {
    return true;
  }

  // sellShares(address sharesSubject, uint256 amount)
  if (transaction.sigHash === '0xb51d0534') {
    return true;
  }

  return false;
};

// Contextualize for txs
export const generate = (transaction: Transaction): Transaction => {
  // Failed transaction
  if (!transaction.receipt?.status) {
    // buyShares(address sharesSubject, uint256 amount)
    if (transaction.sigHash === '0x6945b123') {
      const parsedTx = decodeTransactionInput(
        transaction.input as Hex,
        ABIs.FriendTech,
      );
      transaction.context = {
        variables: {
          price: {
            type: 'eth',
            value: parsedTx.args[1].toString(),
            unit: 'wei',
          },
          subject: {
            type: 'address',
            value: parsedTx.args[0].toString(),
          },
          buyer: {
            type: 'address',
            value: transaction.from,
          },
          failedToBuyKeys: {
            type: 'contextAction',
            value: 'FAILED_TO_BUY_KEYS',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'friend.tech',
            default:
              '[[buyer]] [[failedToBuyKeys]] of [[subject]] for [[price]]',
          },
        },
      };
    }
  }

  // buyShares(address sharesSubject, uint256 amount)
  if (transaction.sigHash === '0x6945b123') {
    try {
      const log = transaction.logs[0];
      const parsedLog = decodeLog(
        ABIs.FriendTech,
        log.data as Hex,
        log.topics as EventLogTopics,
      );

      const trader = parsedLog.args['trader'];
      const subject = parsedLog.args['subject'];
      const ethAmount = parsedLog.args['ethAmount'];
      const supply = parsedLog.args['supply'];

      // Check if this is a user signing up
      if (trader === subject && ethAmount === '0' && supply === '1') {
        transaction.context = {
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'friend.tech',
              default:
                '[[buyer]] [[boughtShares]] of [[subject]] for [[price]]',
            },
          },
          variables: {
            subject: {
              type: 'address',
              value: subject,
            },
          },
        };
        return transaction;
      }

      transaction.context = {
        variables: {
          price: {
            type: 'eth',
            value: ethAmount,
            unit: 'wei',
          },
          subject: {
            type: 'address',
            value: subject,
          },
          buyer: {
            type: 'address',
            value: trader,
          },
          boughtKeys: {
            type: 'contextAction',
            value: 'BOUGHT_KEYS',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Friendtech',
            default: '[[buyer]] [[boughtKeys]] of [[subject]] for [[price]]',
          },
        },
      };

      return transaction;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // sellShares(address sharesSubject, uint256 amount)
  if (transaction.sigHash === '0xb51d0534') {
    try {
      const log = transaction.logs[0];
      const parsedLog = decodeLog(
        ABIs.FriendTech,
        log.data as Hex,
        log.topics as EventLogTopics,
      );

      const trader = parsedLog.args['trader'];
      const subject = parsedLog.args['subject'];
      const ethAmount = parsedLog.args['ethAmount'];

      transaction.context = {
        variables: {
          price: {
            type: 'eth',
            value: ethAmount,
            unit: 'wei',
          },
          subject: {
            type: 'address',
            value: subject,
          },
          trader: {
            type: 'address',
            value: trader,
          },
          soldKeys: {
            type: 'contextAction',
            value: 'SOLD_KEYS',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'friend.tech',
            default: '[[trader]] [[soldKeys]] of [[subject]] for [[price]]',
          },
        },
      };
      return transaction;
    } catch (e) {
      console.log(e);
      return transaction;
    }
  }

  return transaction;
};
