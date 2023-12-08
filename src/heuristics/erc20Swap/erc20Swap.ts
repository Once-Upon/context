import { ContextSummaryVariableType, Transaction } from '../../types';

export function contextualize(transaction: Transaction): Transaction {
  const isERC20Swap = detect(transaction);
  if (!isERC20Swap) return transaction;

  return generate(transaction);
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
export function detect(transaction: Transaction): boolean {
  /**
   * There is a degree of overlap between the 'detect' and 'generateContext' functions,
   *  and while this might seem redundant, maintaining the 'detect' function aligns with
   * established patterns in our other modules. This consistency is beneficial,
   * and it also serves to decouple the logic, thereby simplifying the testing process
   */

  // All assets transferred are type ETH or ERC20
  if (
    transaction.assetTransfers?.some(
      (asset) => asset.type !== 'eth' && asset.type !== 'erc20',
    )
  ) {
    return false;
  }

  // From account (swapper) sent and received 1 asset
  if (
    !(
      transaction.netAssetTransfers?.[transaction.from]?.received?.length ===
        1 &&
      transaction.netAssetTransfers?.[transaction.from]?.sent?.length === 1
    )
  ) {
    return false;
  }

  const swapperSent = transaction.netAssetTransfers[transaction.from].sent[0];
  const swapperReceived =
    transaction.netAssetTransfers[transaction.from].received[0];

  // Swapper did not send and receive the same type of asset
  if (
    swapperSent.type === swapperReceived.type &&
    swapperSent.asset === swapperReceived.asset
  ) {
    return false;
  }

  return true;
}

function generate(transaction: Transaction): Transaction {
  const swapper: ContextSummaryVariableType = {
    type: 'address',
    value: transaction.from,
  };
  const swapFrom = transaction.netAssetTransfers[transaction.from]
    .sent[0] as ContextSummaryVariableType;
  // Net asset transfers calls the token contract 'asset' instead of 'token'
  swapFrom['token'] = swapFrom['asset'];
  const swapTo = transaction.netAssetTransfers[transaction.from]
    .received[0] as ContextSummaryVariableType;
  // Net asset transfers calls the token contract 'asset' instead of 'token'
  swapTo['token'] = swapTo['asset'];

  transaction.context = {
    variables: {
      swapper,
      swapFrom,
      swapTo,
    },
    summaries: {
      category: 'FUNGIBLE_TOKEN',
      en: {
        title: 'ERC20 Swap',
        default: '[[swapper]] [[swapped]] [[swapFrom]] for [[swapTo]]',
        variables: {
          swapped: {
            type: 'contextAction',
            value: 'swapped',
          },
        },
      },
    },
  };
  return transaction;
}
