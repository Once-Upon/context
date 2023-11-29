import { Transaction } from '../types';

export function tokenTransferContextualizer(
  transaction: Transaction,
): Transaction {
  const isTokenTransfer = detectTokenTransfer(transaction);
  if (!isTokenTransfer) return transaction;

  return generateTokenTransferContext(transaction);
}

export function detectTokenTransfer(transaction: Transaction): boolean {
  if (!transaction.assetTransfers || transaction.assetTransfers.length !== 1) {
    return false;
  }

  // ERC721 transferFrom && safeTransferFrom
  if (
    transaction.decode?.fragment.name === 'transfer' ||
    transaction.decode?.fragment.name === 'transferFrom' ||
    transaction.decode?.fragment.name === 'safeTransferFrom'
  ) {
    if (transaction.assetTransfers?.length === 1) {
      return true;
    }
  }

  return false;
}

export function generateTokenTransferContext(
  transaction: Transaction,
): Transaction {
  // We do this so we can use the assetTransfer var directly in the outcomes for contextualizations
  // The contextualizations expect a property "token", not "asset"
  const assetTransfer = {
    ...transaction.assetTransfers[0],
    token: transaction.assetTransfers[0].asset,
  };
  delete assetTransfer.asset;
  const sender = assetTransfer.from;
  const recipient = assetTransfer.to;

  let tokenDetails = {};
  if (assetTransfer.type === 'erc721') {
    tokenDetails = {
      tokenId: assetTransfer.tokenId,
    };
  } else if (assetTransfer.type === 'erc20') {
    tokenDetails = {
      value: assetTransfer.value,
    };
  } else if (assetTransfer.type === 'erc1155') {
    tokenDetails = {
      tokenId: assetTransfer.tokenId,
      value: assetTransfer.value,
    };
  }

  transaction.context = {
    summaries: {
      category: 'FUNGIBLE_TOKEN',
      en: {
        title: 'Token Transfer',
        default: '[[sender]] [[sent]] [[token]] to [[recipient]]',
        variables: {
          sent: {
            type: 'contextAction',
            value: 'Sent',
          },
        },
      },
    },
    variables: {
      sender: {
        type: 'address',
        value: sender,
      },
      token: {
        type: assetTransfer.type,
        token: assetTransfer.token,
        ...tokenDetails,
      },
      recipient: {
        type: 'address',
        value: recipient,
      },
    },
  };

  return transaction;
}
