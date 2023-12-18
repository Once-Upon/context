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
  if (!Object.keys(ENS_CONTRACTS.registrar).includes(transaction.to)) {
    return false;
  }
  try {
    const abi = ENS_CONTRACTS.registrar[transaction.to].abi;
    const decode: ReturnType<typeof decodeTransactionInput<typeof abi>> =
      decodeTransactionInput(transaction.input as Hex, abi);

    if (
      decode.functionName === 'registerWithConfig' ||
      decode.functionName === 'register' ||
      decode.functionName === 'commit' ||
      decode.functionName === 'renew'
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
  const abi = ENS_CONTRACTS.registrar[transaction.to].abi;
  let decode: ReturnType<typeof decodeTransactionInput<typeof abi>>;
  try {
    decode = decodeTransactionInput(transaction.input as Hex, abi);
  } catch (error) {
    return transaction;
  }

  switch (decode.functionName) {
    case 'registerWithConfig':
    case 'register': {
      const name = decode.args[0];
      const duration = parseInt(decode.args[2] as string);
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
            type: 'number',
            emphasis: true,
            value: durationInDays,
            unit: 'days',
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
      const duration = parseInt(decode.args[1] as string);
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
            type: 'number',
            emphasis: true,
            value: durationInDays,
            unit: 'days',
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
