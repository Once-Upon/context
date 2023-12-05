import { Transaction } from '../../types';

export function contractDeploymentContextualizer(
  transaction: Transaction,
): Transaction {
  const isContractDeployment = detectContractDeployment(transaction);

  if (!isContractDeployment) return transaction;

  return generateContractDeploymentContext(transaction);
}

export function detectContractDeployment(transaction: Transaction): boolean {
  if (transaction.to === null && transaction.receipt?.contractAddress) {
    return true;
  }
  return false;
}

function generateContractDeploymentContext(
  transaction: Transaction,
): Transaction {
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
