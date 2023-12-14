import { Abi, Hex } from 'viem';
import { Transaction } from '../../types';
import { ENS_CONTRACTS } from './constants';
import { decodeTransactionInputViem } from '../../helpers/utils';

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
    const decode = decodeTransactionInputViem(
      transaction.input as Hex,
      ENS_CONTRACTS.reverse[transaction.to].abi as Abi,
    );

    if (decode.functionName === 'setName') {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};

export const generate = (transaction: Transaction): Transaction => {
  const decode = decodeTransactionInputViem(
    transaction.input as Hex,
    ENS_CONTRACTS.reverse[transaction.to].abi as Abi,
  );
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
