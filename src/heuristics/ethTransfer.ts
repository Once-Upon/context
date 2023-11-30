import { Transaction } from '../types';

export function ethTransferContextualizer(
  transaction: Transaction,
): Transaction {
  const isEthTransfer = detectETHTransfer(transaction);
  if (!isEthTransfer) return transaction;

  return generateETHTransferContext(transaction);
}

export function detectETHTransfer(transaction: Transaction): boolean {
  // TODO; check logs from transaction
  if (
    (transaction.input === '0x' || transaction.input === '') &&
    transaction.value !== '0' &&
    transaction.logs?.length === 0
  ) {
    return true;
  }

  return false;
}

export function generateETHTransferContext(
  transaction: Transaction,
): Transaction {
  transaction.context = {
    variables: {
      sender: {
        type: 'address',
        value: transaction.from,
      },

      amount: {
        type: 'eth',
        value: transaction.value,
      },
      to: {
        type: 'address',
        value: transaction.to,
      },
    },
    summaries: {
      category: 'CORE',
      en: {
        title: 'ETH Transfer',
        default: '[[sender]] [[sent]] [[amount]] to [[to]]',
        variables: {
          sent: {
            type: 'contextAction',
            value: 'sent',
          },
        },
      },
    },
  };

  return transaction;
}
