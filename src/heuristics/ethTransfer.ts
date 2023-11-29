import { Transaction } from '../types';

export async function ethTransferContextualizer(
  transaction: Transaction,
): Promise<Transaction> {
  const isEthTransfer = await detectETHTransfer(transaction);
  if (!isEthTransfer) return transaction;

  return generateETHTransferContext(transaction);
}

async function detectETHTransfer(
  transaction: Transaction,
): Promise<boolean> {

  // TODO; check logs from transaction
  if (
    (transaction.input === '0x' || transaction.input === '') &&
    transaction.value !== '0' 
    // && transaction.logs?.length === 0
  ) {
    return true;
  }

  return false;
}

function generateETHTransferContext(transaction: Transaction): Transaction {
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
            value: 'Sent',
          },
        },
      },
    },
  };

  return transaction;
}
