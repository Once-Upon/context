import { Hex } from 'viem';
import { Transaction } from '../../types';
import { ENS_CONTRACTS, ENS_ADDRESSES } from './constants';
import { decodeTransactionInput } from '../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isENS = detect(transaction);
  if (!isENS) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== ENS_ADDRESSES.reverse) {
    return false;
  }

  const abi = ENS_CONTRACTS.reverse[transaction.to].abi;
  const decode = decodeTransactionInput(transaction.input as Hex, abi);
  if (!decode) {
    return false;
  }

  if (decode.functionName === 'setName') {
    return true;
  }

  return false;
};

export const generate = (transaction: Transaction): Transaction => {
  if (transaction.to !== ENS_ADDRESSES.reverse) {
    return transaction;
  }

  const abi = ENS_CONTRACTS.reverse[transaction.to].abi;
  const decode = decodeTransactionInput(transaction.input as Hex, abi);
  if (!decode) return transaction;

  switch (decode.functionName) {
    case 'setName': {
      const name = decode.args[0];
      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: 'ENS',
            default: `[[setter]] [[reversed]] [[name]]`,
          },
        },
        variables: {
          setter: {
            type: 'address',
            value: transaction.from,
          },
          name: {
            type: 'string',
            emphasis: true,
            value: name,
          },
          reversed: {
            type: 'contextAction',
            value: 'SET_REVERSE_ENS_TO',
          },
        },
      };
      return transaction;
    }

    default: {
      return transaction;
    }
  }
};
