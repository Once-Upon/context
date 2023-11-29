import { Transaction } from '../types';

export function superchainFaucetContextualizer(
  transaction: Transaction,
): Transaction {
  const isSuperchainFaucetTransaction =
    detectSuperchainFaucetTransaction(transaction);

  if (!isSuperchainFaucetTransaction) return transaction;

  return generateSuperchainFaucetTransaction(transaction);
}

export function detectSuperchainFaucetTransaction(
  transaction: Transaction,
): boolean {
  // Check if user cancelled pending transaction
  if (
    transaction.to === '0xf21d42203af9af1c86e1e8ac501b41f5bc004a0a' &&
    transaction.assetTransfers?.length === 2
  ) {
    return true;
  }

  return false;
}

export function generateSuperchainFaucetTransaction(
  transaction: Transaction,
): Transaction {
  // Pull out relevant data for faucet transaction
  transaction.context = {
    variables: {
      depositer: {
        type: 'address',
        value: transaction.to,
      },
      depositee: {
        type: 'address',
        value: transaction.assetTransfers[1].to,
      },
      amount: {
        type: 'eth',
        value: transaction.assetTransfers[1].value,
      },
    },
    summaries: {
      category: 'CORE',
      en: {
        title: 'Faucet Deposit',
        default: '[[depositee]] [[received]] [[amount]] from [[depositer]]',
        variables: {
          received: {
            type: 'contextAction',
            value: 'Received',
          },
        },
      },
    },
  };

  return transaction;
}
