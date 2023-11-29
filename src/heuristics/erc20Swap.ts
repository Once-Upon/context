import { Transaction } from '../types';

export function erc20SwapContextualizer(transaction: Transaction): Transaction {
  const isERC20Swap = detectERC20Swap(transaction);
  if (!isERC20Swap) return transaction;

  return generateERC20SwapContext(transaction);
}

export function detectERC20Swap(transaction: Transaction): boolean {
  /**
   * There is a degree of overlap between the 'detect' and 'generateContext' functions,
   *  and while this might seem redundant, maintaining the 'detect' function aligns with
   * established patterns in our other modules. This consistency is beneficial,
   * and it also serves to decouple the logic, thereby simplifying the testing process
   */

  const addresses = transaction.netAssetTransfers
    ? Object.keys(transaction.netAssetTransfers)
    : [];

  // if from address is not in netAssetTransfers, its not ERC20 swap
  if (!addresses.includes(transaction.from.toLowerCase())) {
    return false;
  }

  for (const address of addresses) {
    const sent = transaction.netAssetTransfers[address].sent;
    const received = transaction.netAssetTransfers[address].received;

    const sentCount = sent?.length || 0;
    const receivedCount = received?.length || 0;

    if (sentCount === 1 && receivedCount === 1 && sent[0].type === 'erc20') {
      return true;
    }
  }

  return false;
}

function generateERC20SwapContext(transaction: Transaction): Transaction {
  const addresses = Object.keys(transaction.netAssetTransfers);

  for (const address of addresses) {
    const sent = transaction.netAssetTransfers[address].sent;
    const received = transaction.netAssetTransfers[address].received;

    const sentCount = sent?.length || 0;
    const receivedCount = received?.length || 0;

    if (sentCount === 1 && receivedCount === 1 && sent[0].type === 'erc20') {
      transaction.context = {
        variables: {
          swapper: {
            type: 'address',
            value: address,
          },

          sentToken: {
            token: sent[0].asset,
            type: sent[0].type,
            value: sent[0].value,
          },
          receivedToken: {
            token: received[0].asset,
            type: received[0].type,
            value: received[0].value,
          },
        },
        summaries: {
          category: 'FUNGIBLE_TOKEN',
          en: {
            title: 'ERC20 Swap',
            default:
              '[[swapper]] [[swapped]] [[sentToken]] for [[receivedToken]]',
            variables: {
              swapped: {
                type: 'contextAction',
                value: 'Swapped',
              },
            },
          },
        },
      };
    }
  }
  return transaction;
}
