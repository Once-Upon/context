import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

// Contextualizer for the StorageRegistry contract:
// https://github.com/farcasterxyz/contracts/blob/main/src/interfaces/IStorageRegistry.sol
//
// Context is not generated for functions that are only callable by the contract owner.
export const contextualize = (transaction: Transaction): Transaction => {
  const isStorageRegistry = detect(transaction);
  if (!isStorageRegistry) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.StorageRegistry.address) {
    return false;
  }

  try {
    const iface = new Interface(FarcasterContracts.StorageRegistry.abi);
    const decoded = iface.parseTransaction({
      data: transaction.input,
      value: transaction.value,
    });

    return ['rent', 'batchRent'].includes(decoded.name);
  } catch (_) {
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
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
          rented: {
            type: 'contextAction',
            value: 'RENTED',
          },
          caller: {
            type: 'address',
            value: transaction.from,
          },
          fid: {
            type: 'farcasterID',
            value: decoded.args[0].toString(),
          },
          units: {
            type: 'number',
            emphasis: true,
            value: units,
            units: `storage unit${units > 1 ? 's' : ''}`,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: `[[caller]] [[rented]] [[units]] for Farcaster ID [[fid]]`,
          },
        },
      };
      return transaction;
    }

    case 'batchRent': {
      const fids = decoded.args[0].length;
      const units = decoded.args[1]
        .reduce((acc, curr) => acc.add(curr))
        .toString();
      transaction.context = {
        variables: {
          rented: {
            type: 'contextAction',
            value: 'RENTED',
          },
          caller: {
            type: 'address',
            value: transaction.from,
          },
          fids: {
            type: 'number',
            emphasis: true,
            value: fids,
            units: `Farcaster ID${fids > 1 ? 's' : ''}`,
          },
          units: {
            type: 'number',
            emphasis: true,
            value: units,
            units: `storage unit${units > 1 ? 's' : ''}`,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: `[[caller]] [[rented]] [[units]] for [[fids]]`,
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
