import {
  Transaction,
  AssetType,
  ETHAsset,
  ERC1155AssetTransfer,
  HeuristicContextActionEnum,
} from '../../../types';
import { KNOWN_ADDRESSES } from '../../../helpers/constants';

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
      transfer.type === AssetType.ERC1155,
  ) as ERC1155AssetTransfer[];

  if (mints.length === 0) {
    return false;
  }

  // only 1 address should receive the minted NFTs
  if (new Set(mints.map((ele) => ele.to)).size !== 1) {
    return false;
  }

  // check if all minted assets are from the same contract
  const isSameContract = mints.every(
    (ele) => ele.contract === mints[0].contract,
  );
  if (!isSameContract) {
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
      transfer.type === AssetType.ERC1155,
  ) as ERC1155AssetTransfer[];

  if (mints.length === 0) {
    return transaction;
  }

  // We do this so we can use the assetTransfer var directly in the outcomes for contextualizations
  // The contextualizations expect a property "token", not "asset"
  const assetTransfer = mints[0];
  const recipient = assetTransfer.to;
  const amount = mints.filter((ele) => ele.type === assetTransfer.type).length;

  const assetSent = transaction.netAssetTransfers[transaction.from]
    ?.sent as ETHAsset[];
  const price =
    assetSent && assetSent.length > 0 && assetSent[0]?.value
      ? assetSent[0].value
      : '0';

  const sender = transaction.from;

  transaction.context = {
    variables: {
      token: {
        type: AssetType.ERC1155,
        token: assetTransfer.contract,
        tokenId: assetTransfer.tokenId,
        value: assetTransfer.value,
      },
      recipient: {
        type: 'address',
        value: recipient,
      },
      sender: {
        type: 'address',
        value: sender,
      },
      minted: {
        type: 'contextAction',
        value: HeuristicContextActionEnum.MINTED,
      },
      price: {
        type: AssetType.ETH,
        value: price,
        unit: 'wei',
      },
    },
  };
  transaction.context.summaries = {
    category: 'NFT',
    en: {
      title: 'NFT Mint',
      default:
        sender === recipient
          ? '[[recipient]][[minted]][[token]]'
          : '[[sender]][[minted]][[token]]to[[recipient]]',
    },
  };
  if (BigInt(price) > BigInt(0)) {
    transaction.context.summaries['en'].default += 'for[[price]]';
  }

  if (amount > 1) {
    transaction.context.variables = {
      ...transaction.context.variables,
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
            ? '[[recipient]][[minted]][[amount]][[token]]'
            : '[[sender]][[minted]][[amount]][[token]]to[[recipient]]',
      },
    };
    if (BigInt(price) > BigInt(0)) {
      transaction.context.summaries['en'].default += 'for[[price]]';
    }
  }

  return transaction;
}
