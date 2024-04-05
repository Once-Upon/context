import { Hex } from 'viem';
import { BNSContextActionEnum, Transaction } from '../../../types';
import { BNS_ADDRESSES, BNS_CONTRACTS } from './constants';
import { decodeTransactionInput } from '../../../helpers/utils';

export const contextualize = (transaction: Transaction): Transaction => {
  const isBNS = detect(transaction);
  if (!isBNS) return transaction;

  return generate(transaction);
};

export const detect = (transaction: Transaction): boolean => {
  if (transaction.to !== BNS_ADDRESSES.nameWrapper) {
    return false;
  }

  const abi = BNS_CONTRACTS.wrapper[transaction.to].abi;
  const decode = decodeTransactionInput(transaction.input as Hex, abi);
  if (!decode) return false;

  if (
    decode.functionName === 'safeTransferFrom' ||
    decode.functionName === 'safeBatchTransferFrom'
  ) {
    return true;
  }

  return false;
};

// Contextualize for mined txs
export const generate = (transaction: Transaction): Transaction => {
  if (transaction.to !== BNS_ADDRESSES.nameWrapper) {
    return transaction;
  }

  const abi = BNS_CONTRACTS.wrapper[transaction.to].abi;
  const decode = decodeTransactionInput(transaction.input as Hex, abi);
  if (!decode) return transaction;

  switch (decode.functionName) {
    case 'safeTransferFrom': {
      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: 'BNS',
            default: `[[sender]][[transfered]]to[[receiver]]`,
          },
        },
        variables: {
          sender: {
            type: 'address',
            value: transaction.from,
          },
          transfered: {
            type: 'contextAction',
            value: BNSContextActionEnum.TRANSFERED_NAME,
          },
          receiver: {
            type: 'address',
            value: decode.args[0],
          },
        },
      };

      return transaction;
    }

    case 'safeBatchTransferFrom': {
      transaction.context = {
        summaries: {
          category: 'IDENTITY',
          en: {
            title: 'BNS',
            default: `[[sender]][[transfered]]to[[receiver]]`,
          },
        },
        variables: {
          sender: {
            type: 'address',
            value: transaction.from,
          },
          transfered: {
            type: 'contextAction',
            value: BNSContextActionEnum.TRANSFERED_NAMES,
          },
          receiver: {
            type: 'address',
            value: decode.args[0],
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
