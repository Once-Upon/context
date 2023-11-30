import { Transaction } from '../types';

export function erc20SwapContextualizer(transaction: Transaction): Transaction {
  const isERC20Swap = detectERC20Swap(transaction);
  if (!isERC20Swap) return transaction;

  return generateERC20SwapContext(transaction);
}

/**
 * Detection criteria
 *
 * We should detect an ERC20 swap if:
 * The from account sent and received 1 asset. The sent and received must be either ETH OR an ERC20.
 * Only 1 other account sends and receives assets (the liquidity pool).
 * This is a simple check against the other addresses in netAssetTransfers (sent.length === 1 && received.length===1)
 * Only 4 addresses max in netAssetTransfers.
 *
 * This is because when using a router there are likely other parties receiving fees. Some erc20s take a fee for any transfers as well. 4 addresses should be safe.
 * To generate the erc20 swap, only look at the tx.from address in netAssetTransfers to pull out the sent/received (i.e., swapped from token X <> to token Y)
 */
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
  // check netAssetTransfer addresses
  if (addresses.length > 4) {
    return false;
  }
  // check if transfer.from sent and receive one asset
  const sent = transaction.netAssetTransfers[transaction.from].sent;
  const received = transaction.netAssetTransfers[transaction.from].received;
  const sentCount = sent?.length || 0;
  const receivedCount = received?.length || 0;
  // check if only one asset was transferred
  if (sentCount !== 1 || receivedCount !== 1) {
    return false;
  }
  // check if asset transferred is erc20 or eth
  if (sent[0].type === 'erc20' || sent[0].type === 'eth') {
    return true;
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
                value: 'swapped',
              },
            },
          },
        },
      };
    }
  }
  return transaction;
}
