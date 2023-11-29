import { Transaction } from '../types';
import { WETH_ADDRESSES } from '../helpers/constants';

export const wethContextualizer = (transaction: Transaction): Transaction => {
  const isWeth = detectWeth(transaction);
  if (!isWeth) {
    return transaction;
  }

  return generateWethContext(transaction);
};

export const detectWeth = (transaction: Transaction): boolean => {
  if (transaction.decode === null || !transaction.to) {
    return false;
  }

  // check contract address
  if (!WETH_ADDRESSES.includes(transaction.to.toLowerCase())) {
    return false;
  }

  if (
    transaction.decode.name !== 'deposit' &&
    transaction.decode.name !== 'withdraw'
  ) {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generateWethContext = (transaction: Transaction): Transaction => {
  switch (transaction.decode.name) {
    case 'deposit': {
      transaction.context = {
        summaries: {
          category: 'FUNGIBLE_TOKEN',
          en: {
            title: 'WETH',
            default: `[[from]] [[wrapped]] [[value]]`,
            variables: {
              wrapped: { type: 'contextAction', value: 'Wrapped' },
            },
          },
        },
        variables: {
          value: {
            type: 'erc20',
            token: transaction.to,
            value: transaction.value,
          },
          from: {
            type: 'address',
            value: transaction.from,
          },
        },
      };

      return transaction;
    }

    case 'withdraw': {
      // get eth flow
      let ethFlow = [];
      for (const address in transaction.netAssetTransfers) {
        const sent = transaction.netAssetTransfers[address].sent;
        const received = transaction.netAssetTransfers[address].received;

        const ethSent = sent.filter((ele) => ele.asset === 'eth');
        const ethReceived = received.filter((ele) => ele.asset === 'eth');

        ethFlow = [...ethFlow, ...ethSent, ...ethReceived];
      }

      transaction.context = {
        summaries: {
          category: 'FUNGIBLE_TOKEN',
          en: {
            title: 'WETH',
            default: `[[from]] [[unwrapped]] [[value]]`,
            variables: {
              unwrapped: { type: 'contextAction', value: 'Unwrapped' },
            },
          },
        },
        variables: {
          value: {
            type: 'eth',
            value: ethFlow?.[0].value,
          },
          from: {
            type: 'address',
            value: transaction.from,
          },
        },
      };

      return transaction;
    }
  }
};
