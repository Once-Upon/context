import { Interface } from 'ethers/lib/utils';
import { Transaction } from '../../types';
import { FarcasterContracts } from './constants';

// Contextualizer for the IdGateway contract:
// https://github.com/farcasterxyz/contracts/blob/main/src/interfaces/IIdGateway.sol
//
// Context is not generated for functions that are only callable by the contract owner.
//
// TODO: Add context for registerFor
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
          owner: {
            type: 'address',
            value: transaction.from,
          },
          fid: {
            type: 'farcasterID',
            value: fid,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: `[[owner]] [[registered]] [[fid]]`,
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
