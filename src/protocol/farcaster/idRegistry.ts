import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

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
    const iface = new Interface(FarcasterContracts.IdRegistry.abi);
    const decoded = iface.parseTransaction({
      data: transaction.input,
      value: transaction.value,
    });

    return ['changeRecoveryAddressFor', 'transfer'].includes(decoded.name);
  } catch (_) {
    return false;
  }
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const iface = new Interface(FarcasterContracts.IdRegistry.abi);
  const decoded = iface.parseTransaction({
    data: transaction.input,
    value: transaction.value,
  });

  switch (decoded.name) {
    case 'changeRecoveryAddressFor': {
      transaction.context = {
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
            value: 'CHANGED_RECOVERY_ADDRESS',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default:
              '[[owner]] [[changedRecoveryAddress]] to [[recoveryAddress]]',
          },
        },
      };
      return transaction;
    }

    case 'transfer': {
      transaction.context = {
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
            value: 'TRANSFERRED_FARCASTER_ID',
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: '[[owner]] [[transferredId]] to [[to]]',
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
