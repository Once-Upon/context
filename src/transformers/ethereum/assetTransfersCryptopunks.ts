import { decodeLog } from '../../helpers/utils';
import {
  AssetType,
  EventLogTopics,
  type AssetTransfer,
  type RawBlock,
  type RawTransaction,
} from '../../types';
import {
  CRYPTO_PUNKS_ADDRESSES,
  KNOWN_ADDRESSES,
  CRYPTO_PUNKS_TRANSFER_EVENTS,
} from '../../helpers/constants';
import { Hex } from 'viem';

function updateTokenTransfers(tx: RawTransaction) {
  const cryptopunksTransfers: AssetTransfer[] = [];

  for (const log of tx.receipt.logs) {
    if (!CRYPTO_PUNKS_ADDRESSES.includes(log.address)) {
      continue;
    }

    const logDescriptor = decodeLog(
      CRYPTO_PUNKS_TRANSFER_EVENTS,
      log.data as Hex,
      log.topics as EventLogTopics,
    );
    if (!logDescriptor) {
      continue;
    }

    switch (logDescriptor.eventName) {
      case 'PunkTransfer':
        cryptopunksTransfers.push({
          contract: log.address,
          from: logDescriptor.args['from'].toLowerCase(),
          to: logDescriptor.args['to'].toLowerCase(),
          tokenId: BigInt(logDescriptor.args['punkIndex']).toString(),
          type: AssetType.ERC721,
        });
        break;
      case 'PunkBought':
        cryptopunksTransfers.push({
          contract: log.address,
          from: logDescriptor.args['fromAddress'].toLowerCase(),
          to: logDescriptor.args['toAddress'].toLowerCase(),
          tokenId: BigInt(logDescriptor.args['punkIndex']).toString(),
          type: AssetType.ERC721,
        });
        break;
      case 'Assign':
        cryptopunksTransfers.push({
          contract: log.address,
          from: KNOWN_ADDRESSES.NULL,
          to: logDescriptor.args['to'].toLowerCase(),
          tokenId: BigInt(logDescriptor.args['punkIndex']).toString(),
          type: AssetType.ERC721,
        });
        break;
      default:
        break;
    }
  }

  // filter old asset transfers from previous asset transfers
  const nonOldAssetTransfers = tx.assetTransfers
    ? tx.assetTransfers.filter(
        (assetTransfer) =>
          assetTransfer.type === AssetType.ETH ||
          !CRYPTO_PUNKS_ADDRESSES.includes(assetTransfer.contract),
      )
    : [];
  const assetTransfers = [...nonOldAssetTransfers, ...cryptopunksTransfers];

  return assetTransfers;
}

export function transform(block: RawBlock): RawBlock {
  block.transactions = block.transactions.map((tx) => {
    const logs = tx.receipt.logs;
    const hasCryptopunksTransfer = logs?.some((log) =>
      CRYPTO_PUNKS_ADDRESSES.includes(log.address),
    );

    if (hasCryptopunksTransfer) {
      tx.assetTransfers = updateTokenTransfers(tx);
    }
    return tx;
  });

  return block;
}
