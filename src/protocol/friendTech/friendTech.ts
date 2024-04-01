import { Hex } from 'viem';
import { AssetType, EventLogTopics, Transaction } from '../../types';
import { ABIs } from './constants';
import { decodeTransactionInput, decodeLog } from '../../helpers/utils';
import { detect } from './detect';

export const contextualize = (transaction: Transaction): Transaction => {
  const isFriendTech = detect(transaction);
  if (!isFriendTech) return transaction;

  return generate(transaction);
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
      if (!parsedTx || !parsedTx.args) return transaction;

      const subject = parsedTx.args[0].toString();
      const shareAmount = Number(parsedTx.args[1]);
      transaction.context = {
        variables: {
          price: {
            type: AssetType.ETH,
            value: transaction.value.toString(),
            unit: 'wei',
          },
          numOfKeys: {
            type: 'number',
            value: shareAmount,
            unit: shareAmount === 1 ? 'key' : 'keys',
          },
          subject: {
            type: 'address',
            value: subject,
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
              '[[buyer]][[failedToBuyKeys]][[numOfKeys]]of[[subject]]for[[price]]',
          },
        },
      };
      return transaction;
    }
  }

  // buyShares(address sharesSubject, uint256 amount)
  if (transaction.sigHash === '0x6945b123') {
    try {
      if (!transaction.logs) return transaction;

      const log = transaction.logs[0];
      const parsedLog = decodeLog(
        ABIs.FriendTech,
        log.data as Hex,
        log.topics as EventLogTopics,
      );
      if (!parsedLog) return transaction;

      const trader = parsedLog.args['trader'];
      const subject = parsedLog.args['subject'];
      const ethAmount = String(parsedLog.args['ethAmount']);
      const supply = Number(parsedLog.args['supply']);
      const shareAmount = Number(parsedLog.args['shareAmount']);

      // Check if this is a user signing up
      if (trader === subject && ethAmount === '0' && supply === 1) {
        transaction.context = {
          summaries: {
            category: 'PROTOCOL_1',
            en: {
              title: 'friend.tech',
              default: '[[subject]][[signedUp]]',
            },
          },
          variables: {
            subject: {
              type: 'address',
              value: subject,
            },
            signedUp: {
              type: 'contextAction',
              value: 'SIGNED_UP',
            },
          },
        };
        return transaction;
      }

      transaction.context = {
        variables: {
          price: {
            type: AssetType.ETH,
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
          numOfKeys: {
            type: 'number',
            value: shareAmount,
            unit: shareAmount === 1 ? 'key' : 'keys',
          },
          boughtKeys: {
            type: 'contextAction',
            value: 'BOUGHT_KEYS',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'friend.tech',
            default:
              '[[buyer]][[boughtKeys]][[numOfKeys]]of[[subject]]for[[price]]',
          },
        },
      };

      return transaction;
    } catch (e) {
      console.log(e);
      return transaction;
    }
  }

  // sellShares(address sharesSubject, uint256 amount)
  if (transaction.sigHash === '0xb51d0534') {
    try {
      if (!transaction.logs) return transaction;

      const log = transaction.logs[0];
      const parsedLog = decodeLog(
        ABIs.FriendTech,
        log.data as Hex,
        log.topics as EventLogTopics,
      );
      if (!parsedLog) return transaction;

      const trader = parsedLog.args['trader'];
      const subject = parsedLog.args['subject'];
      const ethAmount = String(parsedLog.args['ethAmount']);
      const shareAmount = Number(parsedLog.args['shareAmount']);

      transaction.context = {
        variables: {
          price: {
            type: AssetType.ETH,
            value: ethAmount,
            unit: 'wei',
          },
          subject: {
            type: 'address',
            value: subject,
          },
          numOfKeys: {
            type: 'number',
            value: shareAmount,
            unit: shareAmount === 1 ? 'key' : 'keys',
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
            default:
              '[[trader]][[soldKeys]][[numOfKeys]]of[[subject]]for[[price]]',
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
