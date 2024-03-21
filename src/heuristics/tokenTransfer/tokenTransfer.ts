import { Hex } from 'viem';
import {
  AssetType,
  ContextSummaryVariableType,
  Transaction,
} from '../../types';
import ERC20ERC721transferABI from './abis/combined';
import { decodeTransactionInput } from '../../helpers/utils';

export function contextualize(transaction: Transaction): Transaction {
  const isTokenTransfer = detect(transaction);
  if (!isTokenTransfer) return transaction;

  return generate(transaction);
}

export function detect(transaction: Transaction): boolean {
  if (!transaction.assetTransfers || transaction.assetTransfers.length !== 1) {
    return false;
  }

  // ERC721 transferFrom && safeTransferFrom
  const decoded = decodeTransactionInput(transaction.input as Hex, ERC20ERC721transferABI);

  if (!decoded) return false;

  if (transaction.assetTransfers?.length === 1) {
    return true;
  }

  return false;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.assetTransfers) return transaction;
  // We do this so we can use the assetTransfer var directly in the outcomes for contextualizations
  // The contextualizations expect a property "token", not "asset"
  const assetTransfer = {
    ...transaction.assetTransfers[0],
  };
  const sender = assetTransfer.from;
  const recipient = assetTransfer.to;

  let tokenDetails = {} as ContextSummaryVariableType;
  if (assetTransfer.type === AssetType.ERC721) {
    tokenDetails = {
      type: AssetType.ERC721,
      tokenId: assetTransfer.tokenId,
      token: assetTransfer.contract,
    };
  } else if (assetTransfer.type === AssetType.ERC20) {
    tokenDetails = {
      type: AssetType.ERC20,
      value: assetTransfer.value,
      token: assetTransfer.contract,
    };
  } else if (assetTransfer.type === AssetType.ERC1155) {
    tokenDetails = {
      value: AssetType.ERC1155,
      tokenId: assetTransfer.tokenId,
      type: assetTransfer.type,
      token: assetTransfer.contract,
    };
  }

  transaction.context = {
    variables: {
      sender: {
        type: 'address',
        value: sender,
      },
      token: tokenDetails,
      recipient: {
        type: 'address',
        value: recipient,
      },
      sent: {
        type: 'contextAction',
        value: 'SENT',
      },
    },
    summaries: {
      category: 'FUNGIBLE_TOKEN',
      en: {
        title: 'Token Transfer',
        default: '[[sender]][[sent]][[token]]to[[recipient]]',
      },
    },
  };

  return transaction;
}
