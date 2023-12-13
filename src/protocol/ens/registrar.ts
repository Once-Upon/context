import { Transaction } from '../../types';
import { ENS_CONTRACTS } from './constants';
import { decodeTransactionInput } from '../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isENS = detect(transaction);
  if (!isENS) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (!Object.keys(ENS_CONTRACTS.registrar).includes(transaction.to)) {
    return false;
  }

  try {
    const decode = decodeTransactionInput(
      transaction.input,
      ENS_CONTRACTS.registrar[transaction.to].abi,
    );

    if (
      decode.name === 'registerWithConfig' ||
      decode.name === 'register' ||
      decode.name === 'commit' ||
      decode.name === 'renew'
    ) {
      return true;
    }

    return false;
  } catch (e) {
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  let decode;
  try {
    decode = decodeTransactionInput(
      transaction.input,
      ENS_CONTRACTS.registrar[transaction.to].abi,
    );
  } catch (error) {
    return transaction;
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
          },
        },
        variables: {
          registerer: {
            type: 'address',
            value: transaction.from,
          },
          name: {
            type: 'string',
            emphasis: true,
            value: `${name}.eth`,
          },
          duration: {
            type: 'string',
            emphasis: true,
            value: `${durationInDays} days`,
          },
          registered: {
            type: 'contextAction',
            value: 'REGISTERED',
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
          },
        },
        variables: {
          committer: {
            type: 'address',
            value: transaction.from,
          },
          committedTo: {
            type: 'contextAction',
            value: 'COMMITTED_TO',
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
          },
        },
        variables: {
          renewer: {
            type: 'address',
            value: transaction.from,
          },
          name: {
            type: 'string',
            emphasis: true,
            value: `${name}.eth`,
          },
          duration: {
            type: 'string',
            emphasis: true,
            value: `${durationInDays} days`,
          },
          renewed: {
            type: 'contextAction',
            value: 'RENEWED',
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
