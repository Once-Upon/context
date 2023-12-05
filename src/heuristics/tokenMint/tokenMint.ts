import { Transaction } from '../../types';
import { KNOWN_ADDRESSES, WETH_ADDRESSES } from '../../helpers/constants';

export function tokenMintContextualizer(transaction: Transaction): Transaction {
  const isTokenMint = detectTokenMint(transaction);
  if (!isTokenMint) return transaction;

  return generateTokenMintContext(transaction);
}

/**
 * Detection criteria
 *
 * 1 address receives NFTs, all must be from the same contract. All nfts are minted (meaning they're sent from null address in netAssetTransfers).
 * The from address can send ETH
 * The only other parties in netAssetTransfers are receiving ETH
 */
export function detectTokenMint(transaction: Transaction): boolean {
  if (
    !transaction?.from ||
    !transaction.assetTransfers?.length ||
    transaction.netAssetTransfers === undefined // TODO: This is a hack because of an issue with netAssetTransfers transformer
  ) {
    return false;
  }

  // Get all the mints where from account == to account for the mint transfer
  const mints = transaction.assetTransfers.filter(
    (transfer) =>
      transfer.from === KNOWN_ADDRESSES.NULL &&
      !WETH_ADDRESSES.includes(transfer.asset),
  );

  if (mints.length == 0) {
    return false;
  }
  // check if all minted assets are from the same contract
  const isSameContract = mints.every((ele) => ele.asset === mints[0].asset);
  if (!isSameContract) {
    return false;
  }
  // transfer.from can send some eth
  const assetTransfer = transaction.netAssetTransfers[transaction.from];
  const assetSent = assetTransfer?.sent ?? [];
  if (assetSent.length > 0 && assetSent[0].type !== 'eth') {
    return false;
  }
  // check if other transaction parties received ether
  const transactionParties: string[] = Object.keys(
    transaction.netAssetTransfers,
  )
    .reduce((parties, address) => {
      parties = [...new Set([...parties, address])];
      return parties;
    }, [])
    .filter(
      (address) =>
        address !== KNOWN_ADDRESSES.NULL && address !== transaction.from,
    );

  for (const address of transactionParties) {
    const assetReceived = transaction.netAssetTransfers[address]?.received;
    if (assetReceived.length === 0 || assetReceived[0].type !== 'eth') {
      return false;
    }
  }

  return true;
}

function generateTokenMintContext(transaction: Transaction): Transaction {
  // Get all the mints where from account == to account for the mint transfer
  const mints = transaction.assetTransfers.filter((transfer) => {
    return transfer.from === KNOWN_ADDRESSES.NULL;
  });

  // We do this so we can use the assetTransfer var directly in the outcomes for contextualizations
  // The contextualizations expect a property "token", not "asset"
  const assetTransfer = {
    ...mints[0],
    token: mints[0].asset,
  };
  delete assetTransfer.asset;
  const recipient = assetTransfer.to;

  const tokenDetails =
    assetTransfer.type === 'erc721'
      ? {
          tokenId: assetTransfer.tokenId,
        }
      : assetTransfer.type === 'erc1155'
        ? {
            tokenId: assetTransfer.tokenId,
            value: assetTransfer.value,
          }
        : {
            value: assetTransfer.value,
          };

  transaction.context = {
    variables: {
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
    summaries: {
      category: 'FUNGIBLE_TOKEN',
      en: {
        title: 'Token Mint',
        default: '[[recipient]] [[minted]] [[token]]',
        variables: {
          minted: { type: 'contextAction', value: 'minted' },
        },
      },
    },
  };

  return transaction;
}
