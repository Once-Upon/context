import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

// Contextualizer for the StorageRegistry contract:
// https://github.com/farcasterxyz/contracts/blob/main/src/interfaces/IStorageRegistry.sol
//
// Context is not generated for functions that are only callable by the contract owner.
//
// TODO: Add context for batchRent
export const storageRegistryContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isStorageRegistry = detectStorageRegistry(transaction);
  if (!isStorageRegistry) return transaction;

  return generateStorageRegistryContext(transaction);
};

export const detectStorageRegistry = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.StorageRegistry.address) {
    return false;
  }

  try {
    const iface = new Interface(FarcasterContracts.StorageRegistry.abi);
    const decoded = iface.parseTransaction({
      data: transaction.input,
      value: transaction.value,
    });

    return ['rent'].includes(decoded.name);
  } catch (_) {
    return false;
  }
};

// Contextualize for mined txs
export const generateStorageRegistryContext = (
  transaction: Transaction,
): Transaction => {
  const iface = new Interface(FarcasterContracts.StorageRegistry.abi);
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
            value: decoded.args[0].toString(),
          },
          units: {
            type: 'emphasis',
            value: units.toString(),
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: `[[caller]] [[rented]] [[units]] storage unit${
              units > 1 ? 's' : ''
            } for Farcaster ID [[fid]]`,
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