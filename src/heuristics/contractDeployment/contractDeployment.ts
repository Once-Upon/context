import { Transaction } from '../../types';

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
  transaction.context = {
    variables: {
      deployerAddress: {
        type: 'address',
        value: transaction.from,
      },
      contractAddress: {
        type: 'address',
        value: transaction.receipt?.contractAddress,
      },
    },
    summaries: {
      category: 'DEV',
      en: {
        title: 'Contract Deployed',
        default: '[[deployerAddress]] [[deployed]] [[contractAddress]]',
        variables: {
          deployed: {
            type: 'contextAction',
            value: 'deployed',
          },
        },
      },
    },
  };

  return transaction;
}
