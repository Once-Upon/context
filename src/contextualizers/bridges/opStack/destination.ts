import {
  Transaction,
  AssetType,
  ContextSummaryVariableType,
  ContextETHType,
  ContextERC20Type,
  ContextERC721Type,
  ContextERC1155Type,
  AssetTransfer,
  HeuristicContextActionEnum,
  HeuristicPrefix,
} from '../../../types';

export function contextualize(transaction: Transaction): Transaction {
  const isOpStack = detect(transaction);
  if (!isOpStack) return transaction;

  const result = generate(transaction);
  return result;
}

// Always chain id 1
export function detect(transaction: Transaction): boolean {
  if (
    Number(transaction.gasPrice) === 0 &&
    transaction.input === '0x01' &&
    transaction.from === transaction.to
  ) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  const assetSent = transaction.assetTransfers ?? [];
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

  // TODO; not sure why we didn't set context here for optimism
  transaction.context = {
    actions: [
      HeuristicContextActionEnum.BRIDGED,
      `${HeuristicPrefix}.${HeuristicContextActionEnum.BRIDGED}`,
    ],

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
        value: assetTransfer.from,
      },
      chainID: {
        type: 'chainID',
        value: 1,
      },
      bridged: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.BRIDGED,
        value: HeuristicContextActionEnum.BRIDGED,
      },
      asset,
    },
  };

  return transaction;
}
