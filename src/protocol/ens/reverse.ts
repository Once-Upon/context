import { Transaction } from '../../types';
import { ENSContracts } from './constants';
import { decodeTransactionInput } from '../../helpers/utils';

export const ensReverseContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isENS = detectReverseENS(transaction);
  if (!isENS) return transaction;

  return generateENSReverseContext(transaction);
};

export const detectReverseENS = (transaction: Transaction): boolean => {
  if (transaction.to !== ENSContracts.Reverse.address) {
    return false;
  }

  let decode;
  try {
    decode = decodeTransactionInput(
      transaction.input,
      ENSContracts.Reverse.abi,
    );
  } catch (e) {
    return false;
  }

  if (decode.name !== 'setName') {
    return false;
  }

  return true;
};

export const generateENSReverseContext = (
  transaction: Transaction,
): Transaction => {
  const decode = decodeTransactionInput(
    transaction.input,
    ENSContracts.Reverse.abi,
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
