import { Hex } from 'viem';
import { Transaction } from '../../types';
import { ENS_CONTRACTS } from './constants';
import { decodeTransactionInput } from '../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isENS = detect(transaction);
  if (!isENS) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (Object.keys(ENS_CONTRACTS.reverse).includes(transaction.to)) {
    return false;
  }

  try {
    const abi = ENS_CONTRACTS.reverse[transaction.to].abi;
    const decode: ReturnType<typeof decodeTransactionInput<typeof abi>> =
      decodeTransactionInput(transaction.input as Hex, abi);

    if (decode.functionName === 'setName') {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};

export const generate = (transaction: Transaction): Transaction => {
  const abi = ENS_CONTRACTS.reverse[transaction.to].abi;
  const decode: ReturnType<typeof decodeTransactionInput<typeof abi>> =
    decodeTransactionInput(transaction.input as Hex, abi);

  switch (decode.functionName) {
    case 'setName': {
      const name = decode.args[0] as string;
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
