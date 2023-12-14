import { ContextSummaryVariableType, Transaction } from '../../types';
import { WETH_ADDRESSES } from '../../helpers/constants';
import { WETH_ABI } from './constants';
import { decodeTransactionInput } from '../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isWeth = detect(transaction);
  if (!isWeth) {
    return transaction;
  }

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  try {
    if (!transaction.to) {
      return false;
    }
    // check contract address
    if (!WETH_ADDRESSES.includes(transaction.to.toLowerCase())) {
      return false;
    }

    // decode input
    let decode;
    try {
      decode = decodeTransactionInput(transaction.input, WETH_ABI);
    } catch (e) {
      return false;
    }

    if (!decode || !decode.name) return false;
    if (decode.name !== 'deposit' && decode.name !== 'withdraw') {
      return false;
    }
    return true;
  } catch (err) {
    console.error('Error in detect function:', err);
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  // decode input
  const decode = decodeTransactionInput(transaction.input, WETH_ABI);
  switch (decode.name) {
    case 'deposit': {
      transaction.context = {
        summaries: {
          category: 'FUNGIBLE_TOKEN',
          en: {
            title: 'WETH',
            default: `[[from]] [[wrapped]] [[value]]`,
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
          wrapped: { type: 'contextAction', value: 'WRAPPED' },
        },
      };

      return transaction;
    }

    case 'withdraw': {
      const decode = decodeTransactionInput(transaction.input, WETH_ABI);
      const withdrawer: ContextSummaryVariableType = {
        type: 'address',
        value: transaction.from,
      };
      const withdrawalAmount: ContextSummaryVariableType = {
        type: 'eth',
        value: BigInt(decode.args[0]).toString(),
      };
      transaction.context = {
        summaries: {
          category: 'FUNGIBLE_TOKEN',
          en: {
            title: 'WETH',
            default: `[[withdrawer]] [[unwrapped]] [[withdrawalAmount]]`,
          },
        },
        variables: {
          withdrawalAmount,
          withdrawer,
          unwrapped: { type: 'contextAction', value: 'UNWRAPPED' },
        },
      };

      return transaction;
    }
  }
};
