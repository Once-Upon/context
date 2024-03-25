import { decodeLog } from '../../helpers/utils';
import {
  AssetType,
  type AssetTransfer,
  type EventLogTopics,
  type RawBlock,
  type RawTransaction,
} from '../../types';
import {
  KNOWN_ADDRESSES,
  OLD_NFT_ADDRESSES,
  ERC721_TRANSFER_EVENT_1,
  ERC721_TRANSFER_EVENT_2,
} from '../../helpers/constants';
import { Hex } from 'viem';

function updateTokenTransfers(tx: RawTransaction) {
  const oldNFTsTransfers: AssetTransfer[] = [];

  for (const log of tx.receipt.logs) {
    if (!OLD_NFT_ADDRESSES.includes(log.address)) {
      continue;
    }

    // for cryptopunks, we skip Transfer event and parse PunkTransfer
    if (
      log.address === KNOWN_ADDRESSES.CryptoPunksNew ||
      log.address === KNOWN_ADDRESSES.CryptoPunksOld
    ) {
      continue;
    }

    // check for old nfts
    let logDescriptor;
    logDescriptor = decodeLog(
      ERC721_TRANSFER_EVENT_1,
      log.data as Hex,
      log.topics as EventLogTopics,
    );
    if (!logDescriptor) {
      logDescriptor = decodeLog(
        ERC721_TRANSFER_EVENT_2,
        log.data as Hex,
        log.topics as EventLogTopics,
      );
    }

    if (logDescriptor) {
      oldNFTsTransfers.push({
        contract: log.address,
        from: logDescriptor.args['from'].toLowerCase(),
        to: logDescriptor.args['to'].toLowerCase(),
        tokenId: BigInt(logDescriptor.args['value']).toString(),
        type: AssetType.ERC721,
      });
    }
  }

  // filter old asset transfers from previous asset transfers
  const nonOldAssetTransfers = tx.assetTransfers.filter(
    (assetTransfer) =>
      assetTransfer.type === AssetType.ETH ||
      !OLD_NFT_ADDRESSES.includes(assetTransfer.contract),
  );
  const assetTransfers = [...nonOldAssetTransfers, ...oldNFTsTransfers];

  return assetTransfers;
}

export function transform(block: RawBlock): RawBlock {
  block.transactions = block.transactions.map((tx) => {
    const hasOldNFTTransfer = tx.assetTransfers?.some(
      (assetTransfer) =>
        assetTransfer.type !== AssetType.ETH &&
        OLD_NFT_ADDRESSES.includes(assetTransfer.contract),
    );
    if (hasOldNFTTransfer) {
      tx.assetTransfers = updateTokenTransfers(tx);
    }
    return tx;
  });

  return block;
}
