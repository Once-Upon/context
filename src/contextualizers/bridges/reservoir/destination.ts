import { formatNativeToken } from '../../../helpers/utils';
import { Transaction, AssetType, ETHAsset } from '../../../types';
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

  const sourceChainId = transaction.chainId === 7777777 ? 1 : 7777777;
  transaction.context = {
    summaries: {
      category: 'MULTICHAIN',
      en: {
        title: `Bridge`,
        default: '[[sender]][[bridged]][[asset]]from[[chainID]]',
      },
    },
    variables: {
      sender: {
        type: 'address',
        value: transaction.to,
      },
      chainID: {
        type: 'chainID',
        value: sourceChainId,
      },
      bridged: {
        type: 'contextAction',
        value: 'BRIDGED',
      },
      asset: {
        type: formatNativeToken(transaction.chainId ?? 1),
        value: assetTransfer.value,
        unit: 'wei',
      },
    },
  };

  return transaction;
}
