import { ethers } from 'ethers';
import { Transaction } from '../../types';
import { WETH_ADDRESSES, WETH_ABI } from '../../helpers/constants';
import { decodeTransactionInput } from '../../helpers/utils';

export const wethContextualizer = (transaction: Transaction): Transaction => {
  const isWeth = detectWeth(transaction);
  if (!isWeth) {
    return transaction;
  }

  return generateWethContext(transaction);
};

export const detectWeth = (transaction: Transaction): boolean => {
  try {
    if (!transaction.to) {
      return false;
    }
    // check contract address
    if (!WETH_ADDRESSES.includes(transaction.to.toLowerCase())) {
      return false;
    }
    // decode input
    const transactionDescriptor = decodeTransactionInput(
      transaction.input,
      WETH_ABI,
    );

    if (
      transactionDescriptor.name !== 'deposit' &&
      transactionDescriptor.name !== 'withdraw'
    ) {
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error in detectWeth function:', err);
    return false;
  }
};

// Contextualize for mined txs
export const generateWethContext = (transaction: Transaction): Transaction => {
  // decode input
  const transactionDescriptor = decodeTransactionInput(
    transaction.input,
    WETH_ABI,
  );
  switch (transactionDescriptor.name) {
    case 'deposit': {
      transaction.context = {
        summaries: {
          category: 'FUNGIBLE_TOKEN',
          en: {
            title: 'WETH',
            default: `[[from]] [[wrapped]] [[value]]`,
            variables: {
              wrapped: { type: 'contextAction', value: 'wrapped' },
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
              unwrapped: { type: 'contextAction', value: 'unwrapped' },
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
