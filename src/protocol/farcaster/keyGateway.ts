import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

const ABI = [
  'function add(uint32 keyType, bytes key, uint8 metadataType, bytes metadata)',
  'function addFor(address fidOwner, uint32 keyType, bytes key, uint8 metadataType, bytes metadata, uint256 deadline, bytes sig)',
];

export const keyGatewayContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isKeyGateway = detectKeyGateway(transaction);
  if (!isKeyGateway) return transaction;

  return generateKeyGatewayContext(transaction);
};

export const detectKeyGateway = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.KeyGateway) {
    return false;
  }

  const iface = new Interface(ABI);
  const decoded = iface.parseTransaction({
    data: transaction.input,
    value: transaction.value,
  });

  if (!['add', 'addFor'].includes(decoded.name)) {
    return false;
  }

  return true;
};

// Contextualize for mined txs
export const generateKeyGatewayContext = (
  transaction: Transaction,
): Transaction => {
  const iface = new Interface(ABI);
  const decoded = iface.parseTransaction({
    data: transaction.input,
    value: transaction.value,
  });

  switch (decoded.name) {
    case 'add': {
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
            default: '[[owner]] [[addedKey]]',
            variables: {
              addedKey: {
                type: 'contextAction',
                value: 'added a key',
              },
            },
          },
        },
      };
      return transaction;
    }

    case 'addFor': {
      transaction.context = {
        variables: {
          caller: {
            type: 'address',
            value: transaction.from,
          },
          owner: {
            type: 'address',
            value: decoded.args[0],
          },
        },
        summaries: {
          category: 'OTHER',
          en: {
            title: 'Farcaster',
            default: '[[caller]] [[addedKeyFor]] [[owner]]',
            variables: {
              removedKeyFor: {
                type: 'contextAction',
                value: 'added a key for',
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
