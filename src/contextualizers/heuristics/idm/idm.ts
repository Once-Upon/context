import { HeuristicContextActionEnum, Transaction } from '../../../types';
import {
  hexToString,
  countValidChars,
  addAssetTransfersToContext,
} from '../../../helpers/utils';

export function contextualize(transaction: Transaction): Transaction {
  const isIdm = detect(transaction);
  if (!isIdm) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
  if (
    transaction.input !== '0x0' &&
    transaction.input &&
    transaction.input.length > 15
  ) {
    const convertedString = hexToString(transaction.input.slice(2));
    const numValidChars = countValidChars(convertedString);
    const percentValidChars = numValidChars / convertedString.length;
    if (percentValidChars > 0.7) {
      return true;
    }
  }

  return false;
}

function generate(transaction: Transaction): Transaction {
  if (!transaction.to) return transaction;

  transaction.context = {
    variables: {
      messageSender: {
        type: 'address',
        value: transaction.from,
      },
      message: {
        type: 'string',
        value: hexToString(transaction.input.slice(2)),
      },
      sentMessage: {
        type: 'contextAction',
        value: HeuristicContextActionEnum.SENT_MESSAGE,
      },
      receiver: {
        type: 'address',
        value: transaction.to,
      },
    },
    summaries: {
      category: 'OTHER',
      en: {
        title: 'Input Data Message',
        default: '[[messageSender]][[sentMessage]]to[[receiver]][[message]]',
      },
    },
  };

  // add asset transfers in context
  return addAssetTransfersToContext(transaction);
}
