import { Hex } from 'viem';
import { Transaction } from '../../../types';
import { BNS_ADDRESSES, BNS_CONTRACTS } from './constants';
import { decodeTransactionInput } from '../../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isBNS = detect(transaction);
  if (!isBNS) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== BNS_ADDRESSES.publicResolver) {
    return false;
  }

  const abi = BNS_CONTRACTS.resolver[transaction.to].abi;
  const decode = decodeTransactionInput(transaction.input as Hex, abi);
  if (!decode) return false;

  if (
    decode.functionName === 'setAddr' ||
    decode.functionName === 'setText' ||
    decode.functionName === 'setContenthash' ||
    decode.functionName === 'multicall'
  ) {
    return true;
  }

  return false;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  if (transaction.to !== BNS_ADDRESSES.publicResolver) {
    return transaction;
  }

  const abi = BNS_CONTRACTS.resolver[transaction.to].abi;
  const decode = decodeTransactionInput(transaction.input as Hex, abi);
  if (!decode) return transaction;

  switch (decode.functionName) {
    case 'multicall': {
      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: 'BNS',
            default: `[[owner]][[updated]]`,
          },
        },
        variables: {
          owner: {
            type: 'address',
            value: transaction.from,
          },
          updated: {
            type: 'contextAction',
            value: 'UPDATED_RECORDS',
          },
        },
      };

      return transaction;
    }
    case 'setAddr': {
      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: 'BNS',
            default: `[[owner]][[updated]]`,
          },
        },
        variables: {
          owner: {
            type: 'address',
            value: transaction.from,
          },
          updated: {
            type: 'contextAction',
            value: 'UPDATED_ADDRESS',
          },
        },
      };

      return transaction;
    }

    case 'setText': {
      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: 'BNS',
            default: `[[owner]][[updated]]`,
          },
        },
        variables: {
          owner: {
            type: 'address',
            value: transaction.from,
          },
          updated: {
            type: 'contextAction',
            value: 'UPDATED_TEXT',
          },
        },
      };

      return transaction;
    }

    case 'setContenthash': {
      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: 'BNS',
            default: `[[owner]][[updated]]`,
          },
        },
        variables: {
          owner: {
            type: 'address',
            value: transaction.from,
          },
          updated: {
            type: 'contextAction',
            value: 'UPDATED_CONTENTHASH',
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
