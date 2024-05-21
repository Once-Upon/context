import { HeuristicContextActionEnum, Transaction } from '../../../types';

export function contextualize(transaction: Transaction): Transaction {
  if (!detect(transaction)) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
  return !!transaction.pseudotransactions?.length;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.pseudotransactions) return transaction;

  const userOps = transaction.pseudotransactions.length;
  transaction.context = {
    variables: {
      subject: {
        type: 'address',
        value: transaction.from,
      },
      userOps: {
        type: 'number',
        emphasis: true,
        value: userOps,
        unit: `user op${userOps > 1 ? 's' : ''}`,
      },
      contextAction: {
        type: 'contextAction',
        value: HeuristicContextActionEnum.SUBMITTED_ACCOUNT_ABSTRACTION_BUNDLE,
      },
    },
    summaries: {
      category: 'ACCOUNT_ABSTRACTION',
      en: {
        title: 'ERC4337 Bundle',
        default: '[[subject]][[contextAction]]with[[userOps]]',
      },
    },
  };

  return transaction;
}
