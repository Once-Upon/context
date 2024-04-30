import {
  Transaction,
  AssetType,
  BridgeContextActionEnum,
  ContextSummaryVariableType,
  ContextETHType,
  ContextERC20Type,
  ContextERC721Type,
  ContextERC1155Type,
  AssetTransfer,
} from '../../../types';
import { BRIDGE_ZORA_ENERGY } from './constants';

export function contextualize(transaction: Transaction): Transaction {
  const isBridgeZoraEnergy = detect(transaction);
  if (!isBridgeZoraEnergy) return transaction;

  const result = generate(transaction);
  return result;
}

// Always chain id 1 through the Zora bridge UI
export function detect(transaction: Transaction): boolean {
  if (transaction.from !== BRIDGE_ZORA_ENERGY || !transaction.to) {
    return false;
  }

  const assetSent =
    transaction.assetTransfers?.filter(
      (asset) => asset.from === transaction.from,
    ) ?? [];
  if (!assetSent.length) {
    return false;
  }

  return true;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.to) return transaction;

  const assetSent =
    transaction.assetTransfers?.filter(
      (asset) => asset.from === transaction.from,
    ) ?? [];
  if (!assetSent?.length) {
    return transaction;
  }
  const assetTransfer: AssetTransfer = assetSent[0];
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
        value: assetTransfer.to,
      },
      address: {
        type: 'address',
        value: transaction.from,
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
