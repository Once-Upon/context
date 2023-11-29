import { Transaction } from '../types';

export function cancelPendingTransactionContextualizer(
  transaction: Transaction,
): Transaction {
  const isCanceledPendingTransaction =
    detectCancelPendingTransaction(transaction);

  if (!isCanceledPendingTransaction) return transaction;

  return generateCancelPendingTransactionContext(transaction);
}

export function detectCancelPendingTransaction(
  transaction: Transaction,
): boolean {
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

export function generateCancelPendingTransactionContext(
  transaction: Transaction,
): Transaction {
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
