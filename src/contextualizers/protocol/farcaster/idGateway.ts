import { Hex } from 'viem';
import {
  EventLogTopics,
  FarcasterContextActionEnum,
  Transaction,
} from '../../../types';
import { FarcasterContracts } from './constants';
import { decodeLog, decodeTransactionInput } from '../../../helpers/utils';

// Contextualizer for the IdGateway contract:
// https://github.com/farcasterxyz/contracts/blob/main/src/interfaces/IIdGateway.sol
//
// Context is not generated for functions that are only callable by the contract owner.
export const contextualize = (transaction: Transaction): Transaction => {
  const isIdGateway = detect(transaction);
  if (!isIdGateway) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.IdGateway.address) {
    return false;
  }
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    FarcasterContracts.IdGateway.abi,
  );
  if (!decoded) return false;

  return ['register', 'registerFor'].includes(decoded.functionName);
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    FarcasterContracts.IdGateway.abi,
  );
  if (!decoded) return transaction;

  // Capture FID
  let fid = '';
  if (transaction.receipt?.status) {
    const registerLog = transaction.logs?.find((log) => {
      return log.address === FarcasterContracts.IdRegistry.address;
    });
    if (registerLog) {
      const decoded = decodeLog(
        FarcasterContracts.IdRegistry.abi,
        registerLog.data as Hex,
        [
          registerLog.topic0,
          registerLog.topic1,
          registerLog.topic2,
          registerLog.topic3,
        ] as EventLogTopics,
      );
      if (!decoded) return transaction;

      fid = BigInt(decoded.args['id']).toString();
    }
  }

  switch (decoded.functionName) {
    case 'register': {
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
          registered: {
            type: 'contextAction',
            value: FarcasterContextActionEnum.REGISTERED_FARCASTER_ID,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: `[[owner]][[registered]][[fid]]`,
          },
        },
      };
      return transaction;
    }

    case 'registerFor': {
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
          fid: {
            type: 'farcasterID',
            value: fid,
          },
          registered: {
            type: 'contextAction',
            value: FarcasterContextActionEnum.REGISTERED_FARCASTER_ID,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: 'Farcaster',
            default: '[[caller]][[registered]][[fid]]for[[owner]]',
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
