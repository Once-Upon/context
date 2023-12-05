import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

export const bundlerContextualizer = (
  transaction: Transaction,
): Transaction => {
  const isBundler = detectBundler(transaction);
  if (!isBundler) return transaction;

  return generateBundlerContext(transaction);
};

export const detectBundler = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.Bundler.address) {
    return false;
  }

  try {
    const iface = new Interface(FarcasterContracts.Bundler.abi);
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
export const generateBundlerContext = (
  transaction: Transaction,
): Transaction => {
  const iface = new Interface(FarcasterContracts.Bundler.abi);
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
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: callerIsOwner
              ? '[[caller]] [[registered]]'
              : '[[caller]] [[registered]] for [[owner]]',
            variables: {
              registered: {
                type: 'contextAction',
                value: 'registered Farcaster ID',
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
