import {
  AssetType,
  ETHAssetTransfer,
  HeuristicContextActionEnum,
  HeuristicPrefix,
  Transaction,
} from '../../../types';

export function contextualize(transaction: Transaction): Transaction {
  const isSuperchainFaucetTransaction = detect(transaction);

  if (!isSuperchainFaucetTransaction) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
  // Check if user cancelled pending transaction
  if (
    transaction.to === '0xf21d42203af9af1c86e1e8ac501b41f5bc004a0a' &&
    transaction.assetTransfers?.length === 2
  ) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.assetTransfers || !transaction.to) return transaction;
  const ethTransfer = transaction.assetTransfers[1] as ETHAssetTransfer;
  // Pull out relevant data for faucet transaction
  transaction.context = {
    actions: [
      HeuristicContextActionEnum.RECEIVED,
      `${HeuristicPrefix}.${HeuristicContextActionEnum.RECEIVED}`,
    ],

    variables: {
      depositer: {
        type: 'address',
        value: transaction.to,
      },
      depositee: {
        type: 'address',
        value: ethTransfer.to,
      },
      amount: {
        type: AssetType.ETH,
        value: ethTransfer.value,
        unit: 'wei',
      },
      received: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.RECEIVED,
        value: HeuristicContextActionEnum.RECEIVED, // TODO: Make a Superchain version of this
      },
    },

    summaries: {
      category: 'CORE',
      en: {
        title: 'Faucet Deposit',
        default: '[[depositee]][[received]][[amount]]from[[depositer]]',
      },
    },
  };

  return transaction;
}
