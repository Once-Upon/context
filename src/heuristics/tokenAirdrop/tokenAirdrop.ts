import { Transaction } from '../../types';
import { AIRDROP_THRESHOLD, KNOWN_ADDRESSES } from '../../helpers/constants';

export function tokenAirdropContextualizer(
  transaction: Transaction,
): Transaction {
  const isTokenAirdrop = detectTokenAirdrop(transaction);
  if (!isTokenAirdrop) return transaction;

  return generateTokenAirdropContext(transaction);
}

export function detectTokenAirdrop(transaction: Transaction): boolean {
  /**
   * There is a degree of overlap between the 'detect' and 'generateContext' functions,
   *  and while this might seem redundant, maintaining the 'detect' function aligns with
   * established patterns in our other modules. This consistency is beneficial,
   * and it also serves to decouple the logic, thereby simplifying the testing process
   */
  if (!transaction.assetTransfers?.length) {
    return false;
  }

  const airdropTracker: Record<
    string,
    { amount: number; assetTransfers: Set<any> }
  > = {};

  for (const assetTransfer of transaction.assetTransfers) {
    const transferKey = `${assetTransfer.from}-${assetTransfer.asset}-${assetTransfer.type}`;
    if (!airdropTracker[transferKey]) {
      airdropTracker[transferKey] = {
        amount: 0,
        assetTransfers: new Set(),
      };
    }
    airdropTracker[transferKey].amount++;
    airdropTracker[transferKey].assetTransfers.add(assetTransfer);

    if (airdropTracker[transferKey].amount > AIRDROP_THRESHOLD) {
      return true;
    }
  }

  return false;
}

function generateTokenAirdropContext(transaction: Transaction): Transaction {
  // Summary context
  const tokenTransfers = transaction.assetTransfers.filter(
    (x) => x.type === 'erc721' || x.type === 'erc1155' || x.type === 'erc20',
  );
  const assets = Array.from(new Set(tokenTransfers.map((x) => x.asset)));
  const senders = Array.from(new Set(tokenTransfers.map((x) => x.from)));
  const recipients = Array.from(new Set(tokenTransfers.map((x) => x.to)));

  const firstAssetTransfer =
    tokenTransfers.length > 0 ? tokenTransfers[0] : null;

  if (!firstAssetTransfer) {
    return transaction;
  }
  const firstToken = {
    type: firstAssetTransfer.type,
    token: firstAssetTransfer.asset,
    tokenId: firstAssetTransfer.tokenId,
    value: firstAssetTransfer.value,
  };

  const category =
    firstAssetTransfer.type === 'erc721' ? 'NFT' : 'FUNGIBLE_TOKEN';

  transaction.context = {
    variables: {
      recipient:
        recipients.length === 1
          ? {
              type: 'address',
              value: recipients[0],
            }
          : {
              type: 'emphasis',
              value: `${recipients.length} Users`,
            },
      token:
        transaction.assetTransfers.length === 1
          ? firstToken
          : assets.length === 1
            ? {
                type: 'address',
                value: firstAssetTransfer.asset,
              }
            : {
                type: 'emphasis',
                value: `${transaction.assetTransfers.length} Assets`,
              },
      sender:
        senders.length === 1
          ? {
              type: 'address',
              value: senders[0],
            }
          : {
              type: 'emphasis',
              value: `${senders.length} Senders`,
            },
    },
    summaries: {
      category,
      en: {
        title: 'Token Airdrop',
        default: `[[recipient]] [[receivedAirdrop]] [[token]]${
          senders.some((x) => x !== KNOWN_ADDRESSES.NULL)
            ? ' from [[sender]]'
            : ''
        }`,
        variables: {
          receivedAirdrop: {
            type: 'contextAction',
            value: 'received airdrop',
          },
        },
      },
    },
  };

  return transaction;
}
