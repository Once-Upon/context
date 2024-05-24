import {
  AssetType,
  ContextHexType,
  ERC20Asset,
  Transaction,
  ContextERC20Type,
  ETHAsset,
  ContextETHType,
  HeuristicContextActionEnum,
} from '../../../types';

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
      (asset) => asset.type !== AssetType.ETH && asset.type !== AssetType.ERC20,
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

  const swapperSent = transaction.netAssetTransfers[transaction.from]
    .sent[0] as ERC20Asset;
  const swapperReceived = transaction.netAssetTransfers[transaction.from]
    .received[0] as ERC20Asset;

  // Swapper did not send and receive the same type of asset
  if (
    swapperSent.type === swapperReceived.type &&
    swapperSent.contract === swapperReceived.contract
  ) {
    return false;
  }

  return true;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.netAssetTransfers) {
    return transaction;
  }

  const swapper: ContextHexType = {
    type: 'address',
    value: transaction.from,
  };
  const assetSent = transaction.netAssetTransfers[transaction.from].sent as (
    | ERC20Asset
    | ETHAsset
  )[];
  const assetReceived = transaction.netAssetTransfers[transaction.from]
    .received as (ERC20Asset | ETHAsset)[];
  const swapFrom =
    assetSent[0].type === AssetType.ERC20
      ? ({
          ...assetSent[0],
          token: assetSent[0]?.contract,
        } as ContextERC20Type)
      : ({
          ...assetSent[0],
          unit: 'wei',
        } as ContextETHType);
  // Net asset transfers calls the token contract 'asset' instead of 'token'
  console.log('assetReceived', transaction.hash, assetReceived[0]);
  const swapTo =
    assetReceived[0].type === AssetType.ERC20
      ? ({
          ...assetReceived[0],
          token: assetReceived[0]?.contract,
        } as ContextERC20Type)
      : ({
          ...assetReceived[0],
          unit: 'wei',
        } as ContextETHType);
  // Net asset transfers calls the token contract 'asset' instead of 'token'

  transaction.context = {
    variables: {
      swapper,
      swapFrom,
      swapTo,
      swapped: {
        type: 'contextAction',
        value: HeuristicContextActionEnum.SWAPPED,
      },
    },
    summaries: {
      category: 'FUNGIBLE_TOKEN',
      en: {
        title: 'ERC20 Swap',
        default: '[[swapper]][[swapped]][[swapFrom]]for[[swapTo]]',
      },
    },
  };
  return transaction;
}
