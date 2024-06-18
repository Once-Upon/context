import { Hex } from 'viem';
import { BNSContextActionEnum, ProtocolMap, Protocols, Transaction } from '../../../types';
import { BNS_CONTRACTS, BNS_ADDRESSES } from './constants';
import { decodeTransactionInput } from '../../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isBNS = detect(transaction);
  if (!isBNS) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== BNS_ADDRESSES.reverseRegistrar) {
    return false;
  }

  const abi = BNS_CONTRACTS.reverse[transaction.to].abi;
  const decode = decodeTransactionInput(transaction.input as Hex, abi);
  if (!decode) {
    return false;
  }

  if (decode.functionName === 'setName') {
    return true;
  }

  return false;
};

export const generate = (transaction: Transaction): Transaction => {
  if (transaction.to !== BNS_ADDRESSES.reverseRegistrar) {
    return transaction;
  }

  const abi = BNS_CONTRACTS.reverse[transaction.to].abi;
  const decode = decodeTransactionInput(transaction.input as Hex, abi);
  if (!decode) return transaction;

  switch (decode.functionName) {
    case 'setName': {
      const name = decode.args[0];
      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: ProtocolMap[Protocols.BNS],
            default: `[[setter]][[reversed]][[name]]`,
          },
        },
        variables: {
          setter: {
            type: 'address',
            value: transaction.from,
          },
          name: {
            type: 'string',
            emphasis: true,
            value: name,
          },
          reversed: {
            type: 'contextAction',
            id: `${Protocols.BNS}.${BNSContextActionEnum.SET_REVERSE_BNS_TO}`,
            value: BNSContextActionEnum.SET_REVERSE_BNS_TO,
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
