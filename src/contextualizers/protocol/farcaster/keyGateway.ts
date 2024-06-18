import { Hex } from 'viem';
import {
  FarcasterContextActionEnum,
  ProtocolMap,
  Protocols,
  Transaction,
} from '../../../types';
import { FarcasterContracts } from './constants';
import { decodeTransactionInput } from '../../../helpers/utils';

// Contextualizer for the KeyGateway contract:
// https://github.com/farcasterxyz/contracts/blob/main/src/interfaces/IKeyGateway.sol
export const contextualize = (transaction: Transaction): Transaction => {
  const isKeyGateway = detect(transaction);
  if (!isKeyGateway) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== FarcasterContracts.KeyGateway.address) {
    return false;
  }

  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    FarcasterContracts.KeyGateway.abi,
  );
  if (!decoded) return false;

  return ['add', 'addFor'].includes(decoded.functionName);
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  const decoded = decodeTransactionInput(
    transaction.input as Hex,
    FarcasterContracts.KeyGateway.abi,
  );
  if (!decoded) return transaction;

  switch (decoded.functionName) {
    case 'add': {
      transaction.context = {
        variables: {
          owner: {
            type: 'address',
            value: transaction.from,
          },
          addedKey: {
            type: 'contextAction',
            id: `${Protocols.FARCASTER}.${FarcasterContextActionEnum.ADDED_A_KEY}`,
            value: FarcasterContextActionEnum.ADDED_A_KEY,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.FARCASTER],
            default: '[[owner]][[addedKey]]',
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
          addedKey: {
            type: 'contextAction',
            id: `${Protocols.FARCASTER}.${FarcasterContextActionEnum.ADDED_A_KEY}`,
            value: FarcasterContextActionEnum.ADDED_A_KEY,
          },
        },
        summaries: {
          category: 'PROTOCOL_1',
          en: {
            title: ProtocolMap[Protocols.FARCASTER],
            default: '[[caller]][[addedKey]]for[[owner]]',
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
