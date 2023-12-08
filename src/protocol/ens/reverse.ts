import { Transaction } from '../../types';
import { ENS_CONTRACTS } from './constants';
import { decodeTransactionInput } from '../../helpers/utils';

export const ensReverseContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isENS = detectReverseENS(transaction);
  if (!isENS) return transaction;

  return generateENSReverseContext(transaction);
};

export const detectReverseENS = (transaction: Transaction): boolean => {
  if (Object.keys(ENS_CONTRACTS.reverse).includes(transaction.to)) {
    return false;
  }

  try {
    const decode = decodeTransactionInput(
      transaction.input,
      ENS_CONTRACTS.reverse[transaction.to].abi,
    );

    if (decode.name === 'setName') {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};

export const generateENSReverseContext = (
  transaction: Transaction,
): Transaction => {
  const decode = decodeTransactionInput(
    transaction.input,
    ENS_CONTRACTS.reverse[transaction.to].abi,
  );
  switch (decode.name) {
    case 'setName': {
      const name = decode.args[0];
      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: 'ENS',
            default: `[[setter]] [[reversed]] [[name]]`,
            variables: {
              reversed: {
                type: 'contextAction',
                value: 'set reverse ens to',
              },
            },
          },
        },
        variables: {
          setter: {
            type: 'address',
            value: transaction.from,
          },
          name: {
            type: 'emphasis',
            value: name,
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
