import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

const ABI = ['function rent(uint256 fid, uint256 units)'];

export const storageRegistryContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isStorageRegistry = detectStorageRegistry(transaction);
  if (!isStorageRegistry) return transaction;

  return generateStorageRegistryContext(transaction);
};

export const detectStorageRegistry = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.StorageRegistry) {
    return false;
  }

  if (transaction.decode.name !== 'rent') {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generateStorageRegistryContext = (
  transaction: Transaction,
): Transaction => {
  const iface = new Interface(ABI);
  const decoded = iface.parseTransaction({
    data: transaction.input,
    value: transaction.value,
  });

  switch (decoded.name) {
    case 'rent': {
      const units = decoded.args[1];
      transaction.context = {
        variables: {
          caller: {
            type: 'address',
            value: transaction.from,
          },
          fid: {
            type: 'emphasis',
            value: `Farcaster ID #${decoded.args[0]}`,
          },
          units: {
            type: 'emphasis',
            value: `${units} storage unit${units > 1 ? 's' : ''}`,
          },
        },
        summaries: {
          category: 'OTHER',
          en: {
            title: 'Farcaster',
            default: '[[caller]] [[rented]] [[units]] for [[fid]]',
            variables: {
              rented: {
                type: 'contextAction',
                value: 'rented',
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
