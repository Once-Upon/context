import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

const ABI = [
  'function remove(bytes key)',
  'function removeFor(address fidOwner, bytes key, uint256 deadline, bytes calldata sig)',
];

export const keyRegistryContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isKeyRegistry = detectKeyRegistry(transaction);
  if (!isKeyRegistry) return transaction;

  return generateKeyRegistryContext(transaction);
};

export const detectKeyRegistry = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.KeyRegistry) {
    return false;
  }

  const iface = new Interface(ABI);
  const decoded = iface.parseTransaction({
    data: transaction.input,
    value: transaction.value,
  });

  if (!['remove', 'removeFor'].includes(decoded.name)) {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generateKeyRegistryContext = (
  transaction: Transaction,
): Transaction => {
  const iface = new Interface(ABI);
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
          category: 'OTHER',
          en: {
            title: 'Farcaster',
            default: '[[owner]] [[removedKey]]',
            variables: {
              removedKey: {
                type: 'contextAction',
                value: 'removed a key',
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
          category: 'OTHER',
          en: {
            title: 'Farcaster',
            default: '[[caller]] [[removedKeyFor]] [[owner]]',
            variables: {
              removedKeyFor: {
                type: 'contextAction',
                value: 'removed a key for',
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
