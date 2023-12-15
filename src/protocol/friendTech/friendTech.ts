import { Transaction } from '../../types';
import { ABIs, FRIEND_TECH_ADDRESSES } from './constants';

export const contextualize = (transaction: Transaction): Transaction => {
  const isFriendTech = detect(transaction);
  if (!isFriendTech) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  /** implement your detection logic */
  if (transaction.to !== FRIEND_TECH_ADDRESSES || !transaction.logs) {
    return null;
  }
  // Failed transaction
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

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  // Failed transaction
  if (!transaction.receipt?.status) {
    // buyShares(address sharesSubject, uint256 amount)
    if (transaction.sigHash === '0x6945b123') {
      const iface = new Interface(friendtechABI);
      const parsedTx = iface.parseTransaction({ data: transaction.input });
      transaction.context = {
        type: 'Failed Buy Shares',
        outcomes: {
          default: [
            {
              key: 'Price',
              value: {
                desc: `[[price]]`,
                price: {
                  type: 'eth',
                  value: parsedTx.args.amount.toString(),
                },
              },
            },
            {
              key: 'Subject',
              value: {
                desc: `[[subject]]`,
                subject: {
                  type: 'address',
                  value: parsedTx.args.sharesSubject,
                },
              },
            },
            {
              key: 'Buyer',
              value: {
                desc: `[[buyer]]`,
                buyer: {
                  type: 'address',
                  value: transaction.from,
                },
              },
            },
          ],
        },
      };
    }
  }

  const iface = new Interface(ABIs.FriendTech);

  // buyShares(address sharesSubject, uint256 amount)
  if (transaction.sigHash === '0x6945b123') {
    try {
      const parsedLog = iface.parseLog(transaction.logs[0]);

      // Check if this is a user signing up
      if (
        parsedLog.args.trader === parsedLog.args.subject &&
        parsedLog.args.ethAmount.toString() === '0' &&
        parsedLog.args.supply.toString() === '1'
      ) {
        transaction.context = {
          type: 'User Sign Up',
          outcomes: {
            default: [
              {
                key: 'New User',
                value: {
                  desc: `[[subject]]`,
                  subject: {
                    type: 'address',
                    value: parsedLog.args.subject,
                  },
                },
              },
            ],
          },
        };
        return transaction;
      }

      transaction.context = {
        type: 'Buy Shares',
      };

      transaction.context.outcomes = {
        default: [
          {
            key: 'Price',
            value: {
              desc: `[[price]]`,
              price: {
                type: 'eth',
                value: parsedLog.args.ethAmount.toString(),
              },
            },
          },
          {
            key: 'Subject',
            value: {
              desc: `[[subject]]`,
              subject: {
                type: 'address',
                value: parsedLog.args.subject,
              },
            },
          },
          {
            key: 'Buyer',
            value: {
              desc: `[[buyer]]`,
              buyer: {
                type: 'address',
                value: parsedLog.args.trader,
              },
            },
          },
        ],
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
      const parsedLog = iface.parseLog(transaction.logs[0]);

      transaction.context = {
        type: 'Sell Shares',
      };

      transaction.context.outcomes = {
        default: [
          {
            key: 'Price',
            value: {
              desc: `[[price]]`,
              price: {
                type: 'eth',
                value: parsedLog.args.ethAmount.toString(),
              },
            },
          },
          {
            key: 'Subject',
            value: {
              desc: `[[subject]]`,
              subject: {
                type: 'address',
                value: parsedLog.args.subject,
              },
            },
          },
          {
            key: 'Seller',
            value: {
              desc: `[[buyer]]`,
              buyer: {
                type: 'address',
                value: parsedLog.args.trader,
              },
            },
          },
        ],
      };
      return transaction;
    } catch (e) {
      console.log(e);
      return transaction;
    }
  }

  return transaction;
};
