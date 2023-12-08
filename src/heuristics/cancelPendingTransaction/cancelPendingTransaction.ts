import { Transaction } from '../../types';

export function contextualize(transaction: Transaction): Transaction {
  const isCanceledPendingTransaction = detect(transaction);

  if (!isCanceledPendingTransaction) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
  // Check if user cancelled pending transaction
  if (
    transaction.to === transaction.from &&
    (transaction.input === '0x' || transaction.input === '0x0') &&
    transaction.value === '0'
  ) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  transaction.context = {
    summaries: {
      category: 'DEV',
      en: {
        title: 'cancelPendingTransaction',
        default: '',
      },
    },
  };

  return transaction;
}
