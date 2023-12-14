import { Abi, Hex } from 'viem';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';
import { decodeTransactionInputViem } from '../../helpers/utils';

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
    const decoded = decodeTransactionInputViem(
      transaction.input as Hex,
      FarcasterContracts.StorageRegistry.abi as Abi,
    );

    return ['rent', 'batchRent'].includes(decoded.functionName);
  } catch (_) {
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInputViem(
    transaction.input as Hex,
    FarcasterContracts.StorageRegistry.abi as Abi,
  );

  switch (decoded.functionName) {
    case 'rent': {
      const units = decoded.args[1] as number;
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
            type: 'string',
            emphasis: true,
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
          },
        },
      };
      return transaction;
    }

    case 'batchRent': {
      const fidsArg = decoded.args[0] as bigint[];
      const fids = fidsArg.length;
      const unitsArg = decoded.args[1] as bigint[];
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
            type: 'string',
            emphasis: true,
            value: fids.toString(),
          },
          units: {
            type: 'string',
            emphasis: true,
            value: units.toString(),
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: `[[caller]] [[rented]] [[units]] storage unit${
              units > 1 ? 's' : ''
            } for [[fids]] Farcaster ID${fids > 1 ? 's' : ''}`,
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
