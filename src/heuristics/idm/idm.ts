import { Transaction } from '../../types';
import { hexToString, countValidChars } from '../../helpers/utils';

export function idmContextualizer(transaction: Transaction): Transaction {
  const isIdm = detectIdm(transaction);
  if (!isIdm) return transaction;

  return generateIdmContext(transaction);
}

export function detectIdm(transaction: Transaction): boolean {
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

function generateIdmContext(transaction: Transaction): Transaction {
  transaction.context = {
    variables: {
      messageSender: {
        type: 'address',
        value: transaction.from,
      },
      message: {
        type: 'emphasis',
        value: hexToString(transaction.input.slice(2)),
      },
    },
    summaries: {
      category: 'OTHER',
      en: {
        title: 'Input Data Message',
        default: '[[messageSender]] [[sentMessage]][[br]][[message]]',
        variables: {
          sentMessage: {
            type: 'contextAction',
            value: 'sent message',
          },
        },
      },
    },
  };

  return transaction;
}
