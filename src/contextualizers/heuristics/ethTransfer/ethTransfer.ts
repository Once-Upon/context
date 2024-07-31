import { grabLogsFromTransaction } from '../../../helpers/utils';
import {
  AssetType,
  HeuristicContextActionEnum,
  HeuristicPrefix,
  Transaction,
} from '../../../types';

export function contextualize(transaction: Transaction): Transaction {
  const isEthTransfer = detect(transaction);
  if (!isEthTransfer) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
  const logs = grabLogsFromTransaction(transaction);
  // TODO; check logs from transaction
  if (
    transaction.to &&
    transaction.input === '0x' &&
    transaction.value !== BigInt(0) &&
    logs.length === 0
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
    actions: [
      HeuristicContextActionEnum.SENT,
      `${HeuristicPrefix}.${HeuristicContextActionEnum.SENT}`,
    ],

    variables: {
      sender: {
        type: 'address',
        value: transaction.from,
      },

      amount: {
        type: AssetType.ETH,
        value: transaction.value.toString(),
        unit: 'wei',
      },
      to: {
        type: 'address',
        value: transaction.to,
      },
      sent: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.SENT,
        value: HeuristicContextActionEnum.SENT,
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
