import { Transaction } from '../../types';
import { ENSContracts } from './constants';
import { decodeTransactionInput } from '../../helpers/utils';

export const ensContextualizer = (transaction: Transaction): Transaction => {
  const isENS = detectENS(transaction);
  if (!isENS) return transaction;

  return generateENSContext(transaction);
};

export const detectENS = (transaction: Transaction): boolean => {
  if (
    transaction.to !== ENSContracts.RegistrarV2.address &&
    transaction.to !== ENSContracts.RegistrarV3.address
  ) {
    return false;
  }

  // check if v2
  try {
    const decode = decodeTransactionInput(
      transaction.input,
      ENSContracts.RegistrarV2.abi,
    );

    if (
      decode.name === 'registerWithConfig' ||
      decode.name === 'register' ||
      decode.name === 'commit' ||
      decode.name === 'renew'
    ) {
      return true;
    }
  } catch (e) {
    // check if v3
    try {
      const decode = decodeTransactionInput(
        transaction.input,
        ENSContracts.RegistrarV3.abi,
      );

      if (
        decode.name === 'register' ||
        decode.name === 'commit' ||
        decode.name === 'renew'
      ) {
        return true;
      }
    } catch (e) {
      return false;
    }
  }

  return false;
};

// Contextualize for mined txs
export const generateENSContext = (transaction: Transaction): Transaction => {
  let decode;
  try {
    decode = decodeTransactionInput(
      transaction.input,
      ENSContracts.RegistrarV2.abi,
    );
  } catch (error) {
    decode = decodeTransactionInput(
      transaction.input,
      ENSContracts.RegistrarV3.abi,
    );
  }
  switch (decode.name) {
    case 'registerWithConfig':
    case 'register': {
      const name = decode.args[0];
      const duration = parseInt(decode.args[2]);
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
      const name = decode.args[0];
      const duration = parseInt(decode.args[1]);
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
