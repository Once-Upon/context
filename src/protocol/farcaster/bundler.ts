import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

const ABI = [
  'function register(tuple(address to, address recovery, uint256 deadline, bytes sig) registerParams, tuple(uint32 keyType, bytes key, uint8 metadataType, bytes metadata, uint256 deadline, bytes sig)[] signerParams, uint256 extraStorage) external payable returns (uint256)',
];

export const bundlerContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isBundler = detectBundler(transaction);
  if (!isBundler) return transaction;

  return generateBundlerContext(transaction);
};

export const detectBundler = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.Bundler) {
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
export const generateBundlerContext = (
  transaction: Transaction,
): Transaction => {
  const iface = new Interface(ABI);
  const decoded = iface.parseTransaction({
    data: transaction.input,
    value: transaction.value,
  });

  const caller = transaction.from;
  const owner = decoded.args.registerParams.to;

  const callerIsOwner = owner.toLowerCase() === caller.toLowerCase();

  switch (decoded.name) {
    case 'register': {
      transaction.context = {
        variables: {
          caller: {
            type: 'address',
            value: caller,
          },
          owner: {
            type: 'address',
            value: owner,
          },
        },
        summaries: {
          category: 'OTHER',
          en: {
            title: 'Farcaster',
            default: callerIsOwner
              ? '[[caller]] [[registered]]'
              : '[[caller]] [[registered]] for [[owner]]',
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
