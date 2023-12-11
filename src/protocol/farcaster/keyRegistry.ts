import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

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

  try {
    const iface = new Interface(FarcasterContracts.KeyRegistry.abi);
    const decoded = iface.parseTransaction({
      data: transaction.input,
      value: transaction.value,
    });

    return ['remove', 'removeFor'].includes(decoded.name);
  } catch (_) {
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const iface = new Interface(FarcasterContracts.KeyRegistry.abi);
  const decoded = iface.parseTransaction({
    data: transaction.input,
    value: transaction.value,
  });

  switch (decoded.name) {
    case 'remove': {
      transaction.context = {
        variables: {
          owner: {
            type: 'address',
            value: transaction.from,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: '[[owner]] [[removedKey]]',
            variables: {
              removedKey: {
                type: 'contextAction',
                value: 'REMOVED_A_KEY',
              },
            },
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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: '[[caller]] [[removedKey]] for [[owner]]',
            variables: {
              removedKey: {
                type: 'contextAction',
                value: 'REMOVED_A_KEY',
              },
            },
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
