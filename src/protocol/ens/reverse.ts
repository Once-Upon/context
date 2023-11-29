import { Transaction } from '../../types';
import { ENSContracts } from './constants';

export const ensReverseContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isENS = detectReverseENS(transaction);
  if (!isENS) return transaction;

  return generateENSReverseContext(transaction);
};

export const detectReverseENS = (transaction: Transaction): boolean => {
  if (transaction.decode === null) {
    return false;
  }

  if (transaction.to !== ENSContracts.Reverse) {
    return false;
  }

  if (transaction.decode.name !== 'setName') {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generateENSReverseContext = (
  transaction: Transaction,
): Transaction => {
  // Note: This isn't necessary now that we check for this in detect, but that's okay for now
  switch (transaction.decode.name) {
    case 'setName': {
      const name = transaction.decode.args[0];
      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: 'ENS',
            default: `[[setter]] [[reversed]] [[name]]`,
            variables: {
              reversed: {
                type: 'contextAction',
                value: 'Set reverse ens to',
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
