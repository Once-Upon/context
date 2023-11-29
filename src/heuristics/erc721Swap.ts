import { Transaction } from '../types';
import { TOKEN_SWAP_CONTRACTS } from '../helpers/constants';

export function erc721SwapContextualizer(
  transaction: Transaction,
): Transaction {
  const isERC721SwapTx = detectERC721Swap(transaction);
  if (!isERC721SwapTx) return transaction;

  return generateERC721SwapContext(transaction);
}

function detectERC721Swap(transaction: Transaction): boolean {
  /**
   * There is a degree of overlap between the 'detect' and 'generateContext' functions,
   *  and while this might seem redundant, maintaining the 'detect' function aligns with
   * established patterns in our other modules. This consistency is beneficial,
   * and it also serves to decouple the logic, thereby simplifying the testing process
   */
  // Break if this transaction isn't to a token swap contract
  if (TOKEN_SWAP_CONTRACTS.indexOf(transaction.to) === -1) {
    return false;
  }

  const addresses = transaction.netAssetTransfers
    ? Object.keys(transaction.netAssetTransfers)
    : [];

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    const sent = transaction.netAssetTransfers[address].sent;
    const received = transaction.netAssetTransfers[address].received;

    const sentCount = sent?.length || 0;
    const receivedCount = received?.length || 0;
    if (sentCount === 1 && receivedCount === 1) {
      if (transaction.netAssetTransfers[address].sent[0].type === 'erc721') {
        return true;
      }
    }
  }

  return false;
}

function generateERC721SwapContext(transaction: any) {
  const addresses = transaction.netAssetTransfers
    ? Object.keys(transaction.netAssetTransfers)
    : [];

  for (let i = 0; i < addresses.length; i++) {
    const address = addresses[i];
    const sent = transaction.netAssetTransfers[address].sent;
    const received = transaction.netAssetTransfers[address].received;

    const sentCount = sent?.length || 0;
    const receivedCount = received?.length || 0;
    if (sentCount === 1 && receivedCount === 1) {
      if (transaction.netAssetTransfers[address].sent[0].type === 'erc721') {
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
            category: 'NFT',
            en: {
              title: 'ERC721 Swap',
              default:
                '[[swapper]] [[swapped]] [[sentToken]] for [[receivedToken]]',
              variables: {
                swapped: {
                  type: 'contextAction',
                  value: 'swapped',
                },
              },
            },
          },
        };

        break;
      }
    }
  }

  return transaction;
}
