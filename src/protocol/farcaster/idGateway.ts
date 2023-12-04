import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

export const idGatewayContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isIdGateway = detectIdGateway(transaction);
  if (!isIdGateway) return transaction;

  return generateIdGatewayContext(transaction);
};

export const detectIdGateway = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.IdGateway.address) {
    return false;
  }

  try {
    const iface = new Interface(FarcasterContracts.IdGateway.abi);
    const decoded = iface.parseTransaction({
      data: transaction.input,
      value: transaction.value,
    });

    return ['register'].includes(decoded.name);
  } catch (_) {
    return false;
  }
};

// Contextualize for mined txs
export const generateIdGatewayContext = (
  transaction: Transaction,
): Transaction => {
  const iface = new Interface(FarcasterContracts.IdGateway.abi);
  const decoded = iface.parseTransaction({
    data: transaction.input,
    value: transaction.value,
  });

  switch (decoded.name) {
    case 'register': {
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
            default: '[[owner]] [[registered]]',
            variables: {
              registered: {
                type: 'contextAction',
                value: 'registered a Farcaster ID',
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
