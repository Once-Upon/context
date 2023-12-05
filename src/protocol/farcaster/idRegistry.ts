import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

export const idRegistryContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isIdRegistry = detectIdRegistry(transaction);
  if (!isIdRegistry) return transaction;

  return generateIdRegistryContext(transaction);
};

export const detectIdRegistry = (transaction: Transaction): boolean => {
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
export const generateIdRegistryContext = (
  transaction: Transaction,
): Transaction => {
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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: '[[owner]] [[changedRecoveryAddress]] to [[recoveryAddress]]',
            variables: {
              changedRecoveryAddress: {
                type: 'contextAction',
                value: 'changed recovery address',
              },
            },
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
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: '[[owner]] [[transferredId]] to [[to]]',
            variables: {
              transferredId: {
                type: 'contextAction',
                value: 'transferred Farcaster ID',
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
