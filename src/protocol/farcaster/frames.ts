import { Transaction } from '../../types';

export const contextualize = (transaction: Transaction): Transaction => {
  const isEnjoy = detect(transaction);
  if (!isEnjoy) return transaction;

  return generate(transaction);
};

// TODO: Consider modifying all other contextualizations to include this
// rather than making it a separate contextualization
export const detect = (transaction: Transaction): boolean => {
  if (transaction.input.endsWith('fc000023c0')) {
    return true;
  }

  return false;
};

export const generate = (transaction: Transaction): Transaction => {
  transaction.context = {
    variables: {
      referrer: {
        type: 'referrer',
        value: 'Warpcast',
        rawValue: '0xfc000023c0',
      },
    },
    summaries: {
      category: 'PROTOCOL_1',
      en: {
        title: 'Warpcast',
        default: '[[referrer]]',
      },
    },
  };
  return transaction;
};
