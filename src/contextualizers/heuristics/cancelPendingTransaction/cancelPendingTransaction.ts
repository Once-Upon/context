import {
  HeuristicContextActionEnum,
  HeuristicPrefix,
  Transaction,
} from '../../../types';

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
    transaction.value.toString() === BigInt(0).toString()
  ) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  transaction.context = {
    actions: [
      HeuristicContextActionEnum.CANCELED_A_PENDING_TRANSACTION,
      `${HeuristicPrefix}.${HeuristicContextActionEnum.CANCELED_A_PENDING_TRANSACTION}`,
    ],

    variables: {
      subject: {
        type: 'address',
        value: transaction.from,
      },
      canceled: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.CANCELED_A_PENDING_TRANSACTION,
        value: HeuristicContextActionEnum.CANCELED_A_PENDING_TRANSACTION,
      },
      nonce: {
        type: 'number',
        value: transaction.nonce,
      },
    },

    summaries: {
      category: 'DEV',
      en: {
        title: 'Cancellation',
        default: '[[subject]][[canceled]]with nonce[[nonce]]',
      },
    },
  };

  return transaction;
}
