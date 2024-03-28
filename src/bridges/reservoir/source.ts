import { Transaction, AssetType, ETHAsset } from '../../types';
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

  const assetSent = transaction.netAssetTransfers
    ? transaction.netAssetTransfers[transaction.from]?.sent
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
  const assetSent = transaction.netAssetTransfers
    ? transaction.netAssetTransfers[transaction.from]?.sent
    : [];
  const assetTransfer: ETHAsset | undefined = assetSent.find(
    (asset) => asset.type === AssetType.ETH,
  ) as ETHAsset;
  if (!assetTransfer) {
    return transaction;
  }

  const destinationChainId = transaction.chainId === 7777777 ? 1 : 7777777;

  transaction.context = {
    summaries: {
      category: 'MULTICHAIN',
      en: {
        title: `Bridge`,
        default: '[[sender]][[bridged]][[asset]]to[[chainID]]',
      },
    },
    variables: {
      sender: {
        type: 'address',
        value: transaction.from,
      },
      chainID: {
        type: 'chainID',
        value: destinationChainId,
      },
      bridged: {
        type: 'contextAction',
        value: 'BRIDGED',
      },
      asset: {
        type: AssetType.ETH,
        value: assetTransfer.value,
        unit: 'wei',
      },
    },
  };

  return transaction;
}
