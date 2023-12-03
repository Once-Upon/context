import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

const ABI = [
  'function changeRecoveryAddressFor(address owner, address recovery, uint256 deadline, bytes calldata sig)',
  'function transfer(address to,uint256 deadline,bytes sig)',
];

export const idRegistryContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isIdRegistry = detectIdRegistry(transaction);
  if (!isIdRegistry) return transaction;

  return generateIdRegistryContext(transaction);
};

export const detectIdRegistry = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.IdRegistry) {
    return false;
  }

  const iface = new Interface(ABI);
  const decoded = iface.parseTransaction({
    data: transaction.input,
    value: transaction.value,
  });

  if (!['changeRecoveryAddressFor', 'transfer'].includes(decoded.name)) {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generateIdRegistryContext = (
  transaction: Transaction,
): Transaction => {
  const iface = new Interface(ABI);
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
          category: 'OTHER',
          en: {
            title: 'Farcaster',
            default: '[[owner]] [[changedRecoveryAddress]] [[recoveryAddress]]',
            variables: {
              changedRecoveryAddress: {
                type: 'contextAction',
                value: 'changed recovery address to',
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
          category: 'OTHER',
          en: {
            title: 'Farcaster',
            default: '[[owner]] [[transferredId]] [[to]]',
            variables: {
              transferredId: {
                type: 'contextAction',
                value: 'transferred Farcaster ID to',
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
