import { AssetType, Transaction } from '../../../types';

export function contextualize(transaction: Transaction): Transaction {
  const isEthTransfer = detect(transaction);
  if (!isEthTransfer) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
  // TODO; check logs from transaction
  if (
    transaction.to &&
    (transaction.input === '0x' || transaction.input === '') &&
    transaction.value !== '0' &&
    transaction.logs?.length === 0
  ) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.to) {
    return transaction;
  }

  transaction.context = {
    variables: {
      sender: {
        type: 'address',
        value: transaction.from,
      },

      amount: {
        type: AssetType.ETH,
        value: transaction.value,
        unit: 'wei',
      },
      to: {
        type: 'address',
        value: transaction.to,
      },
      sent: {
        type: 'contextAction',
        value: 'SENT',
      },
    },
    summaries: {
      category: 'CORE',
      en: {
        title: 'ETH Transfer',
        default: '[[sender]][[sent]][[amount]]to[[to]]',
      },
    },
  };

  return transaction;
}
