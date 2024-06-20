import { Hex } from 'viem';
import {
  FarcasterContextActionEnum,
  ProtocolMap,
  Protocols,
  Transaction,
} from '../../../types';
import { FarcasterContracts } from './constants';
import { decodeTransactionInput } from '../../../helpers/utils';

// Contextualizer for the IdRegistry contract:
// https://github.com/farcasterxyz/contracts/blob/main/src/interfaces/IIdRegistry.sol
//
// Context is not generated for functions that are only callable by the contract owner.
//
// TODO: Add context for changeRecoveryAddress, recover, recoverFor, transferAndChangeRecovery, transferFor, transferAndChangeRecoveryFor
export const contextualize = (transaction: Transaction): Transaction => {
  const isIdRegistry = detect(transaction);
  if (!isIdRegistry) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.IdRegistry.address) {
    return false;
  }

  try {
    const decoded = decodeTransactionInput(
      transaction.input as Hex,
      FarcasterContracts.IdRegistry.abi,
    );
    if (!decoded) return false;

    return ['changeRecoveryAddressFor', 'transfer'].includes(
      decoded.functionName,
    );
  } catch (_) {
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    FarcasterContracts.IdRegistry.abi,
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'changeRecoveryAddressFor': {
      transaction.context = {
        actions: [
          `${Protocols.FARCASTER}.${FarcasterContextActionEnum.CHANGED_RECOVERY_ADDRESS}`,
        ],

        variables: {
          owner: {
            type: 'address',
            value: decoded.args[0],
          },
          recoveryAddress: {
            type: 'address',
            value: decoded.args[1],
          },
          changedRecoveryAddress: {
            type: 'contextAction',
            id: `${Protocols.FARCASTER}.${FarcasterContextActionEnum.CHANGED_RECOVERY_ADDRESS}`,
            value: FarcasterContextActionEnum.CHANGED_RECOVERY_ADDRESS,
          },
        },

        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.FARCASTER],
            default: '[[owner]][[changedRecoveryAddress]]to[[recoveryAddress]]',
          },
        },
      };
      return transaction;
    }

    case 'transfer': {
      transaction.context = {
        actions: [
          `${Protocols.FARCASTER}.${FarcasterContextActionEnum.TRANSFERRED_FARCASTER_ID}`,
        ],

        variables: {
          owner: {
            type: 'address',
            value: transaction.from,
          },
          to: {
            type: 'address',
            value: decoded.args[0],
          },
          transferredId: {
            type: 'contextAction',
            id: `${Protocols.FARCASTER}.${FarcasterContextActionEnum.TRANSFERRED_FARCASTER_ID}`,
            value: FarcasterContextActionEnum.TRANSFERRED_FARCASTER_ID,
          },
        },

        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.FARCASTER],
            default: '[[owner]][[transferredId]]to[[to]]',
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
