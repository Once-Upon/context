import {
  Transaction,
  AssetType,
  ERC1155AssetTransfer,
  ERC20AssetTransfer,
  ERC721AssetTransfer,
  HeuristicContextActionEnum,
} from '../../../types';
import { KNOWN_ADDRESSES } from '../../../helpers/constants';
import { zeroAddress } from 'viem';

const AIRDROP_THRESHOLD = 10;

export function contextualize(transaction: Transaction): Transaction {
  const isTokenAirdrop = detect(transaction);
  if (!isTokenAirdrop) return transaction;

  return generate(transaction);
}

/**
 * Detection criteria
 *
 * Only 1 address in netAssetTransfers is sending, all other addresses are receiving. It's ok if the only sending address is the null (airdrop via mints)
 * All assets sent are the same asset (contract address)
 * There are more than AIRDROP_THRESHOLD number of receivers. A receiver can receive more than one airdrop.
 */
export function detect(transaction: Transaction): boolean {
  /**
   * There is a degree of overlap between the 'detect' and 'generateContext' functions,
   *  and while this might seem redundant, maintaining the 'detect' function aligns with
   * established patterns in our other modules. This consistency is beneficial,
   * and it also serves to decouple the logic, thereby simplifying the testing process
   */
  if (!transaction.assetTransfers?.length || !transaction.netAssetTransfers) {
    return false;
  }

  // check if only 1 address is sending
  const sendAddresses = Object.keys(transaction.netAssetTransfers).filter(
    (address) => transaction.netAssetTransfers![address]?.sent.length > 0,
  );
  if (sendAddresses.length !== 1) {
    return false;
  }
  // check if all other addresses are receiving
  for (const address in transaction.netAssetTransfers) {
    if (address === sendAddresses[0]) {
      continue;
    }

    const sent = transaction.netAssetTransfers[address]?.sent;
    const received = transaction.netAssetTransfers[address]?.received;
    if (sent?.length || !received?.length) {
      return false;
    }
  }
  // check if there are more than AIRDROP_THRESHOLD number of receivers
  if (
    Object.keys(transaction.netAssetTransfers).length - 1 <
    AIRDROP_THRESHOLD
  ) {
    return false;
  }

  return true;
}

export function generate(transaction: Transaction): Transaction {
  if (!transaction.assetTransfers) {
    return transaction;
  }
  // Summary context
  const tokenTransfers = transaction.assetTransfers.filter(
    (x) =>
      x.type === AssetType.ERC721 ||
      x.type === AssetType.ERC1155 ||
      x.type === AssetType.ERC20,
  ) as (ERC1155AssetTransfer | ERC20AssetTransfer | ERC721AssetTransfer)[];
  const assets = Array.from(new Set(tokenTransfers.map((x) => x.contract)));
  const senders = Array.from(
    new Set(
      tokenTransfers
        .map((x) => x.from)
        .filter((address) => address != zeroAddress),
    ),
  );
  const recipients = Array.from(new Set(tokenTransfers.map((x) => x.to)));

  const firstAssetTransfer =
    tokenTransfers.length > 0 ? tokenTransfers[0] : null;

  if (!firstAssetTransfer) {
    return transaction;
  }

  const firstToken =
    firstAssetTransfer.type === AssetType.ERC20
      ? {
          type: firstAssetTransfer.type,
          token: firstAssetTransfer.contract,
          value: firstAssetTransfer.value,
        }
      : firstAssetTransfer.type === AssetType.ERC721
      ? {
          type: firstAssetTransfer.type,
          token: firstAssetTransfer.contract,
          tokenId: firstAssetTransfer.tokenId,
        }
      : {
          type: firstAssetTransfer.type,
          token: firstAssetTransfer.contract,
          tokenId: firstAssetTransfer.tokenId,
          value: firstAssetTransfer.value,
        };

  const category =
    firstAssetTransfer.type === 'erc721' ? 'NFT' : 'FUNGIBLE_TOKEN';

  transaction.context = {
    actions: [HeuristicContextActionEnum.RECEIVED_AIRDROP],

    variables: {
      recipient:
        recipients.length === 1
          ? {
              type: 'address',
              value: recipients[0],
            }
          : {
              type: 'number',
              value: recipients.length,
              emphasis: true,
              unit: 'users',
            },
      token:
        transaction.assetTransfers.length === 1
          ? firstToken
          : assets.length === 1
          ? {
              type: 'address',
              value: firstAssetTransfer.contract,
            }
          : {
              type: 'number',
              value: transaction.assetTransfers.length,
              emphasis: true,
              unit: 'assets',
            },
      sender:
        senders.length === 1
          ? {
              type: 'address',
              value: senders[0],
            }
          : {
              type: 'number',
              value: senders.length,
              emphasis: true,
              unit: 'senders',
            },
      receivedAirdrop: {
        type: 'contextAction',
        id: HeuristicContextActionEnum.RECEIVED_AIRDROP,
        value: HeuristicContextActionEnum.RECEIVED_AIRDROP,
      },
    },

    summaries: {
      category,
      en: {
        title: 'Token Airdrop',
        default: `[[recipient]][[receivedAirdrop]][[token]]${
          senders.some((x) => x !== KNOWN_ADDRESSES.NULL)
            ? 'from[[sender]]'
            : ''
        }`,
      },
    },
  };

  return transaction;
}
