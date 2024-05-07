import { addAssetTransfersToContext } from '../../../helpers/utils';
import {
  Transaction,
  AssetType,
  ETHAsset,
  BridgeContextActionEnum,
} from '../../../types';
import { BRIDGE_ZORA_ENERGY } from './constants';

export function contextualize(transaction: Transaction): Transaction {
  const isBridgeZoraEnergy = detect(transaction);
  if (!isBridgeZoraEnergy) return transaction;

  const result = generate(transaction);
  return result;
}

export function detect(transaction: Transaction): boolean {
  /**
   * There is a degree of overlap between the 'detect' and 'generateContext' functions,
   *  and while this might seem redundant, maintaining the 'detect' function aligns with
   * established patterns in our other modules. This consistency is beneficial,
   * and it also serves to decouple the logic, thereby simplifying the testing process
   */
  if (transaction.to !== BRIDGE_ZORA_ENERGY) return false;

  const assetSent =
    transaction.netAssetTransfers &&
    transaction.netAssetTransfers[transaction.from] &&
    transaction.netAssetTransfers[transaction.from].sent
      ? transaction.netAssetTransfers[transaction.from].sent
      : [];
  const assetTransfer: ETHAsset | undefined = assetSent.find(
    (asset) => asset.type === AssetType.ETH,
  ) as ETHAsset;
  if (!assetTransfer) {
    return false;
  }

  return true;
}

export function generate(transaction: Transaction): Transaction {
  if (
    !transaction.to ||
    !transaction.netAssetTransfers ||
    !transaction.assetTransfers
  )
    return transaction;
  const assetSent =
    transaction.netAssetTransfers &&
    transaction.netAssetTransfers[transaction.from] &&
    transaction.netAssetTransfers[transaction.from].sent
      ? transaction.netAssetTransfers[transaction.from].sent
      : [];
  const assetTransfer: ETHAsset | undefined = assetSent.find(
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
        default: '[[person]][[initiated]]via[[address]]',
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
      initiated: {
        type: 'contextAction',
        value: BridgeContextActionEnum.INITIATED_A_CROSS_CHAIN_INTERACTION,
      },
    },
  };

  // add asset transfers in context
  return addAssetTransfersToContext(transaction);
}
