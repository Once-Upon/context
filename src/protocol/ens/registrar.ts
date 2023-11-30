import { Transaction } from '../../types';
import { ENSContracts } from './constants';

export const ensContextualizer = (transaction: Transaction): Transaction => {
  const isENS = detectENS(transaction);
  if (!isENS) return transaction;

  return generateENSContext(transaction);
};

export const detectENS = (transaction: Transaction): boolean => {
  if (transaction.decode === null) {
    return false;
  }

  if (
    transaction.to !== ENSContracts.RegistrarV2 &&
    transaction.to !== ENSContracts.RegistrarV3
  ) {
    return false;
  }

  if (
    transaction.decode.name !== 'registerWithConfig' &&
    transaction.decode.name !== 'register' &&
    transaction.decode.name !== 'commit' &&
    transaction.decode.name !== 'renew'
  ) {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generateENSContext = (transaction: Transaction): Transaction => {
  switch (transaction.decode.name) {
    case 'registerWithConfig':
    case 'register': {
      const name = transaction.decode.args[0];
      const duration = parseInt(transaction.decode.args[2]);
      const durationInDays = Math.trunc(duration / 60 / 60 / 24);

      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: 'ENS',
            default: `[[registerer]] [[registered]] [[name]] for [[duration]]`,
            variables: {
              registered: {
                type: 'contextAction',
                value: 'registered',
              },
            },
          },
        },
        variables: {
          registerer: {
            type: 'address',
            value: transaction.from,
          },
          name: {
            type: 'emphasis',
            value: `${name}.eth`,
          },
          duration: {
            type: 'emphasis',
            value: `${durationInDays} days`,
          },
        },
      };

      return transaction;
    }

    case 'commit': {
      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: 'ENS',
            default: `[[committer]] [[committedTo]] registering an ENS name`,
            variables: {
              committedTo: {
                type: 'contextAction',
                value: 'committed to',
              },
            },
          },
        },
        variables: {
          committer: {
            type: 'address',
            value: transaction.from,
          },
        },
      };

      return transaction;
    }

    case 'renew': {
      const name = transaction.decode.args[0];
      const duration = parseInt(transaction.decode.args[1]);
      const durationInDays = Math.trunc(duration / 60 / 60 / 24);

      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: 'ENS',
            default: `[[renewer]] [[renewed]] [[name]] for [[duration]]`,
            variables: {
              renewed: {
                type: 'contextAction',
                value: 'renewed',
              },
            },
          },
        },
        variables: {
          renewer: {
            type: 'address',
            value: transaction.from,
          },
          name: {
            type: 'emphasis',
            value: `${name}.eth`,
          },
          duration: {
            type: 'emphasis',
            value: `${durationInDays} days`,
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
