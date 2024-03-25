import { Hex } from 'viem';
import { Transaction } from '../../../types';
import { FarcasterContracts } from './constants';
import { decodeTransactionInput } from '../../../helpers/utils';

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

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    FarcasterContracts.StorageRegistry.abi,
  );
  if (!decoded) return false;

  return ['rent', 'batchRent'].includes(decoded.functionName);
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    FarcasterContracts.StorageRegistry.abi,
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'rent': {
      const units = Number(decoded.args[1]);
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
            unit: `storage unit${units > 1 ? 's' : ''}`,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: `[[caller]][[rented]][[units]]for Farcaster ID[[fid]]`,
          },
        },
      };
      return transaction;
    }

    case 'batchRent': {
      const fidsArg = decoded.args[0];
      const fids = fidsArg.length;
      const unitsArg = decoded.args[1];
      const units = unitsArg.reduce((acc, curr) => acc + curr);
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
            unit: `Farcaster ID${fids > 1 ? 's' : ''}`,
          },
          units: {
            type: 'number',
            emphasis: true,
            value: Number(units),
            unit: `storage unit${units > 1 ? 's' : ''}`,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: `[[caller]][[rented]][[units]]for[[fids]]`,
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
