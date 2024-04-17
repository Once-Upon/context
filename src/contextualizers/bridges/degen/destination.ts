import {
  Transaction,
  AssetType,
  ETHAsset,
  BridgeContextActionEnum,
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
  const assetTransfer: ETHAsset | undefined = assetReceived.find(
    (asset) => asset.type === AssetType.ETH,
  ) as ETHAsset;
  if (!assetTransfer) {
    return transaction;
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
      asset: {
        type: AssetType.ETH,
        value: assetTransfer.value,
        unit: 'wei',
      },
      completedACrossChainInteraction: {
        type: 'contextAction',
        value: BridgeContextActionEnum.COMPLETED_A_CROSS_CHAIN_INTERACTION,
      },
    },
  };

  return transaction;
}
