import {
  Transaction,
  AssetType,
  HeuristicContextActionEnum,
  ContextERC721Type,
  ContextERC1155Type,
  ContextERC20Type,
  ContextETHType,
  AssetTransfer,
  ContextSummaryVariableType,
  HeuristicPrefix,
} from '../../../types';
import { DEGEN_BRIDGES } from './constants';

export function contextualize(transaction: Transaction): Transaction {
  const isDegenBridge = detect(transaction);
  if (!isDegenBridge) return transaction;

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
  if (
    !transaction.chainId ||
    transaction.to !== DEGEN_BRIDGES[transaction.chainId]
  )
    return false;

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
    actions: [
      HeuristicContextActionEnum.BRIDGED,
      `${HeuristicPrefix}.${HeuristicContextActionEnum.BRIDGED}`,
    ],

    summaries: {
      category: 'MULTICHAIN',
      en: {
        title: `Bridge`,
        default:
          '[[person]][[bridged]]via[[address]]and[[asset]]was transferred',
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
      bridged: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.BRIDGED,
        value: HeuristicContextActionEnum.BRIDGED,
      },
    },
  };

  return transaction;
}
