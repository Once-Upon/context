import {
  Transaction,
  AssetType,
  ETHAsset,
  BridgeContextActionEnum,
  ContextERC1155Type,
  ContextERC721Type,
  ContextERC20Type,
  ContextETHType,
  ContextSummaryVariableType,
  Asset,
} from '../../../types';
import { DEGEN_BRIDGES } from './constants';

export function contextualize(transaction: Transaction): Transaction {
  const isDegenBridge = detect(transaction);
  if (!isDegenBridge) return transaction;

  const result = generate(transaction);
  return result;
}

// Always chain id 1 through the Zora bridge UI
export function detect(transaction: Transaction): boolean {
  if (
    !transaction.chainId ||
    transaction.from !== DEGEN_BRIDGES[transaction.chainId] ||
    !transaction.to
  ) {
    return false;
  }

  const assetReceived =
    transaction.netAssetTransfers &&
    transaction.netAssetTransfers[transaction.to] &&
    transaction.netAssetTransfers[transaction.to].received
      ? transaction.netAssetTransfers[transaction.to].received
      : [];
  const assetTransfer: ETHAsset | undefined = assetReceived.find(
    (asset) => asset.type === AssetType.ETH,
  ) as ETHAsset;
  if (!assetTransfer) {
    return false;
  }

  return true;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.to) return transaction;

  const assetReceived =
    transaction.netAssetTransfers &&
    transaction.netAssetTransfers[transaction.to] &&
    transaction.netAssetTransfers[transaction.to].received
      ? transaction.netAssetTransfers[transaction.to].received
      : [];
  if (!assetReceived?.length) {
    return transaction;
  }
  const assetTransfer: Asset = assetReceived[0];
  let asset: ContextSummaryVariableType;
  switch (assetTransfer.type) {
    case AssetType.ETH:
      asset = {
        type: AssetType.ETH,
        value: assetTransfer.value,
        unit: 'wei',
      } as ContextETHType;
      break;
    case AssetType.ERC20:
      asset = {
        type: AssetType.ERC20,
        token: assetTransfer.contract,
        value: assetTransfer.value,
      } as ContextERC20Type;
      break;
    case AssetType.ERC721:
      asset = {
        type: AssetType.ERC721,
        token: assetTransfer.contract,
        tokenId: assetTransfer.tokenId,
      } as ContextERC721Type;
      break;
    case AssetType.ERC1155:
      asset = {
        type: AssetType.ERC1155,
        token: assetTransfer.contract,
        tokenId: assetTransfer.tokenId,
        value: assetTransfer.value,
      } as ContextERC1155Type;
      break;
  }

  transaction.context = {
    summaries: {
      category: 'MULTICHAIN',
      en: {
        title: `Bridge`,
        default:
          '[[person]][[completedACrossChainInteraction]]via[[address]]and[[asset]]was transferred',
      },
    },
    variables: {
      person: {
        type: 'address',
        value: transaction.from,
      },
      address: {
        type: 'address',
        value: transaction.to,
      },
      asset,
      completedACrossChainInteraction: {
        type: 'contextAction',
        value: BridgeContextActionEnum.COMPLETED_A_CROSS_CHAIN_INTERACTION,
      },
    },
  };

  return transaction;
}
