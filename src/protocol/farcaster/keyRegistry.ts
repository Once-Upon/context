import { Hex } from 'viem';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';
import { decodeTransactionInput } from '../../helpers/utils';

// Contextualizer for the KeyRegistry contract:
// https://github.com/farcasterxyz/contracts/blob/main/src/interfaces/IKeyRegistry.sol
//
// Context is not generated for functions that are only callable by the contract owner.
export const contextualize = (transaction: Transaction): Transaction => {
  const isKeyRegistry = detect(transaction);
  if (!isKeyRegistry) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.KeyRegistry.address) {
    return false;
  }

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    FarcasterContracts.KeyRegistry.abi,
  );
  if (!decoded) return false;

  return ['remove', 'removeFor'].includes(decoded.functionName);
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    FarcasterContracts.KeyRegistry.abi,
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'remove': {
      transaction.context = {
        variables: {
          owner: {
            type: 'address',
            value: transaction.from,
          },
          removedKey: {
            type: 'contextAction',
            value: 'REMOVED_A_KEY',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: '[[owner]] [[removedKey]]',
          },
        },
      };
      return transaction;
    }

    case 'removeFor': {
      transaction.context = {
        variables: {
          caller: {
            type: 'address',
            value: transaction.from,
          },
          owner: {
            type: 'address',
            value: decoded.args[0],
          },
          removedKey: {
            type: 'contextAction',
            value: 'REMOVED_A_KEY',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: '[[caller]] [[removedKey]] for [[owner]]',
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
