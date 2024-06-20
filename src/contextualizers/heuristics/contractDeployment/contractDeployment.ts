import { HeuristicContextActionEnum, Transaction } from '../../../types';

export function contextualize(transaction: Transaction): Transaction {
  const isContractDeployment = detect(transaction);

  if (!isContractDeployment) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
  if (transaction.to === null && transaction.receipt?.contractAddress) {
    return true;
  }
  return false;
}

function generate(transaction: Transaction): Transaction {
  if (!transaction.receipt?.contractAddress) {
    return transaction;
  }

  transaction.context = {
    actions: [HeuristicContextActionEnum.DEPLOYED],

    variables: {
      deployerAddress: {
        type: 'address',
        value: transaction.from,
      },
      contractAddress: {
        type: 'address',
        value: transaction.receipt?.contractAddress,
      },
      deployed: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.DEPLOYED,
        value: HeuristicContextActionEnum.DEPLOYED,
      },
    },

    summaries: {
      category: 'DEV',
      en: {
        title: 'Contract Deployed',
        default: '[[deployerAddress]][[deployed]][[contractAddress]]',
      },
    },
  };

  return transaction;
}
