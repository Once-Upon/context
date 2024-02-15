import {
  AssetType,
  ERC721AssetTransfer,
  ETHAsset,
  Transaction,
} from '../../types';
import { KNOWN_ADDRESSES } from '../../helpers/constants';

export function contextualize(transaction: Transaction): Transaction {
  const isTokenMint = detect(transaction);
  if (!isTokenMint) return transaction;

  return generate(transaction);
}

/**
 * Detection criteria
 *
 * 1 address receives NFTs, all must be from the same contract.
 * All nfts are minted (meaning they're sent from null address in netAssetTransfers).
 * The from address can send ETH
 * Only 1 address should receive nfts
 */
export function detect(transaction: Transaction): boolean {
  if (
    !transaction?.from ||
    !transaction.assetTransfers?.length ||
    !transaction.netAssetTransfers
  ) {
    return false;
  }

  // Get all the mints where from account == to account for the mint transfer
  const mints = transaction.assetTransfers.filter(
    (transfer) =>
      transfer.from === KNOWN_ADDRESSES.NULL &&
      transfer.type === AssetType.ERC721,
  ) as ERC721AssetTransfer[];

  if (mints.length == 0) {
    return false;
  }

  // only 1 address should receive the minted NFTs
  if (new Set(mints.map((ele) => ele.to)).size !== 1) {
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
  if (assetSent.length > 0 && assetSent[0].type !== AssetType.ETH) {
    return false;
  }

  return true;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.assetTransfers || !transaction.netAssetTransfers) {
    return transaction;
  }
  // Get all the mints where from account == to account for the mint transfer
  const mints = transaction.assetTransfers.filter(
    (transfer) =>
      transfer.from === KNOWN_ADDRESSES.NULL &&
      transfer.type === AssetType.ERC721,
  ) as ERC721AssetTransfer[];

  // We do this so we can use the assetTransfer var directly in the outcomes for contextualizations
  // The contextualizations expect a property "token", not "asset"
  const assetTransfer = mints[0];
  const recipient = assetTransfer.to;
  const amount = mints.filter((ele) => ele.type === assetTransfer.type).length;

  const assetSent = transaction.netAssetTransfers[transaction.from]
    ?.sent as ETHAsset[];
  const price = assetSent && assetSent.length ? assetSent[0].value : '0';

  const sender = transaction.from;

  transaction.context = {
    variables: {
      recipient: {
        type: 'address',
        value: recipient,
      },
      sender: {
        type: 'address',
        value: sender,
      },
      price: {
        type: AssetType.ETH,
        value: price,
        unit: 'wei',
      },
      minted: { type: 'contextAction', value: 'MINTED' },
    },
    summaries: {
      category: 'NFT',
      en: {
        title: 'NFT Mint',
        default: '', // filled in below
      },
    },
  };

  if (amount > 1) {
    transaction.context.variables = {
      ...transaction.context.variables,
      multipleERC721s: {
        type: AssetType.ERC721,
        token: assetTransfer.asset,
      },
      amount: {
        type: 'number',
        value: amount,
        unit: 'x',
      },
    };
    transaction.context.summaries = {
      ...transaction.context.summaries,
      en: {
        title: 'NFT Mint',
        default:
          sender === recipient
            ? '[[recipient]] [[minted]] [[amount]] [[multipleERC721s]]'
            : '[[sender]] [[minted]] [[amount]] [[multipleERC721s]] to [[recipient]]',
      },
    };
    if (BigInt(price) > BigInt(0)) {
      transaction.context.summaries['en'].default += ' for [[price]]';
    }
  } else {
    transaction.context.variables = {
      ...transaction.context.variables,
      token: {
        type: AssetType.ERC721,
        token: assetTransfer.asset,
        tokenId: assetTransfer.tokenId,
      },
    };
    transaction.context.summaries = {
      ...transaction.context.summaries,
      en: {
        title: 'NFT Mint',
        default:
          sender === recipient
            ? '[[recipient]] [[minted]] [[token]]'
            : '[[sender]] [[minted]] [[token]] to [[recipient]]',
      },
    };
    if (BigInt(price) > BigInt(0)) {
      transaction.context.summaries['en'].default += ' for [[price]]';
    }
  }

  return transaction;
}
