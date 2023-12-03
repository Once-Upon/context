import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

const ABI = [
  'function register(address recovery) external payable returns (uint256, uint256)',
  'function register(address recovery, uint256 extraStorage) external payable returns (uint256, uint256)',
];

export const idGatewayContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isIdGateway = detectIdGateway(transaction);
  if (!isIdGateway) return transaction;

  return generateIdGatewayContext(transaction);
};

export const detectIdGateway = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.IdGateway) {
    return false;
  }

  const iface = new Interface(ABI);
  const decoded = iface.parseTransaction({
    data: transaction.input,
    value: transaction.value,
  });

  if (!['register'].includes(decoded.name)) {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generateIdGatewayContext = (
  transaction: Transaction,
): Transaction => {
  const iface = new Interface(ABI);
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
