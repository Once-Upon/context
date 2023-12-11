import { Interface } from 'ethers/lib/utils';
import { ContextSummaryVariableType, Transaction } from '../../types';
import { FarcasterContracts } from './constants';

// Contextualizer for the Bundler contract:
// https://github.com/farcasterxyz/contracts/blob/main/src/interfaces/IBundler.sol
export const contextualize = (transaction: Transaction): Transaction => {
  const isBundler = detect(transaction);
  if (!isBundler) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (
    transaction.to !== FarcasterContracts.Bundler.address &&
    transaction.to !== FarcasterContracts.BundlerOld.address
  ) {
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
export const generate = (transaction: Transaction): Transaction => {
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
      // Capture cost to register
      const cost: ContextSummaryVariableType = {
        type: 'eth',
        value: transaction.value,
      };
      // Capture FID
      let fid = '';
      if (transaction.receipt?.status) {
        const registerLog = transaction.logs?.find((log) => {
          return log.address === FarcasterContracts.IdRegistry.address;
        });
        if (registerLog) {
          try {
            const iface = new Interface(FarcasterContracts.IdRegistry.abi);
            const decoded = iface.parseLog({
              topics: registerLog.topics,
              data: registerLog.data,
            });
            fid = decoded.args.id.toString();
          } catch (e) {
            console.error(e);
          }
        }
      }

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
          fid: {
            type: 'farcasterID',
            value: fid,
          },
          cost,
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: callerIsOwner
              ? '[[caller]] [[registered]] [[fid]] for [[cost]]'
              : '[[caller]] [[registered]] [[fid]] for [[owner]] for [[cost]]',
            variables: {
              registered: {
                type: 'contextAction',
                value: 'REGISTERED_FARCASTER_ID',
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
