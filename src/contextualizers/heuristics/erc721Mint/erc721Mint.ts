import {
  AssetType,
  ERC20Asset,
  ERC721AssetTransfer,
  HeuristicContextActionEnum,
  Transaction,
} from '../../../types';
import { KNOWN_ADDRESSES } from '../../../helpers/constants';
import {
  computeERC20Price,
  computeETHPrice,
  processAssetTransfers,
} from '../../../helpers/utils';

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
 * The from address can send ETH or ERC20
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

  const sender = transaction.from;

  // Get all the mints where from account == to account for the mint transfer
  const mints = transaction.assetTransfers.filter(
    (transfer) =>
      transfer.from === KNOWN_ADDRESSES.NULL &&
      transfer.type === AssetType.ERC721,
  ) as ERC721AssetTransfer[];
  if (mints.length === 0) {
    return transaction;
  }
  // We do this so we can use the assetTransfer var directly in the outcomes for contextualizations
  // The contextualizations expect a property "token", not "asset"
  const assetTransfer = mints[0];
  const recipient = assetTransfer.to;
  const amount = mints.filter((ele) => ele.type === assetTransfer.type).length;

  const { erc20Payments, ethPayments } = processAssetTransfers(
    transaction.assetTransfers,
  );

  const totalERC20Payment: Record<string, ERC20Asset> = computeERC20Price(
    erc20Payments,
    transaction.from,
  );
  const totalETHPayment = computeETHPrice(ethPayments, transaction.from);
  const hasPrice =
    BigInt(totalETHPayment) > BigInt(0) ||
    Object.keys(totalERC20Payment).length > 0;

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
      minted: {
        type: 'contextAction',
        value: HeuristicContextActionEnum.MINTED,
      },
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
        token: assetTransfer.contract,
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
            ? '[[recipient]][[minted]][[amount]][[multipleERC721s]]'
            : '[[sender]][[minted]][[amount]][[multipleERC721s]]to[[recipient]]',
      },
    };
    if (hasPrice && transaction.context.variables) {
      transaction.context.summaries['en'].default += 'for[[price]]';
      transaction.context.variables.price =
        ethPayments.length > 0
          ? {
              type: AssetType.ETH,
              value: totalETHPayment.toString(),
              unit: 'wei',
            }
          : {
              type: AssetType.ERC20,
              token: Object.values(totalERC20Payment)[0].contract,
              value: Object.values(totalERC20Payment)[0].value.toString(),
            };
    }
  } else {
    transaction.context.variables = {
      ...transaction.context.variables,
      token: {
        type: AssetType.ERC721,
        token: assetTransfer.contract,
        tokenId: assetTransfer.tokenId,
      },
    };
    transaction.context.summaries = {
      ...transaction.context.summaries,
      en: {
        title: 'NFT Mint',
        default:
          sender === recipient
            ? '[[recipient]][[minted]][[token]]'
            : '[[sender]][[minted]][[token]]to[[recipient]]',
      },
    };
    if (hasPrice) {
      transaction.context.summaries['en'].default += 'for[[price]]';
      transaction.context.variables.price =
        ethPayments.length > 0
          ? {
              type: AssetType.ETH,
              value: totalETHPayment.toString(),
              unit: 'wei',
            }
          : {
              type: AssetType.ERC20,
              token: Object.values(totalERC20Payment)[0].contract,
              value: Object.values(totalERC20Payment)[0].value.toString(),
            };
    }
  }

  return transaction;
}
