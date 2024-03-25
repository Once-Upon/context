import { Hex } from 'viem';
import {
  AssetType,
  EventLogTopics,
  type AssetTransfer,
  type RawBlock,
  type RawTransaction,
} from '../../types';
import {
  KNOWN_ADDRESSES,
  ERC20_TRANSFER_EVENT,
  ERC721_TRANSFER_EVENT,
  ERC1155_TRANSFER_EVENT,
  WETH_EVENTS,
  ERC721_TRANSFER_EVENT_1,
  ERC721_TRANSFER_EVENT_2,
} from '../../helpers/constants';
import { decodeLog } from '../../helpers/utils';

// 1. pull out token transfers from logs
// 2. pull out ETH transfers from traces (this covers tx.value transfers)
// 3. order it all by looking at when contracts where called via traces

function getTokenTransfers(tx: RawTransaction) {
  const txAssetTransfers: AssetTransfer[] = [];

  for (const log of tx.receipt.logs) {
    let logDescriptor;
    // decode log by weth events
    if (log.address === KNOWN_ADDRESSES.WETH) {
      logDescriptor = decodeLog(
        WETH_EVENTS,
        log.data as Hex,
        log.topics as EventLogTopics,
      );
      if (logDescriptor) {
        switch (logDescriptor.eventName) {
          case 'Deposit':
            txAssetTransfers.push({
              contract: log.address,
              from: KNOWN_ADDRESSES.NULL,
              to: logDescriptor.args['dst'].toLowerCase(),
              value: BigInt(logDescriptor.args['wad']).toString(),
              type: AssetType.ERC20,
            });
            break;
          case 'Withdrawal':
            txAssetTransfers.push({
              contract: log.address,
              from: logDescriptor.args['src'].toLowerCase(),
              to: KNOWN_ADDRESSES.NULL,
              value: BigInt(logDescriptor.args['wad']).toString(),
              type: AssetType.ERC20,
            });
            break;
          case 'Transfer':
            txAssetTransfers.push({
              contract: log.address,
              from: logDescriptor.args['src'].toLowerCase(),
              to: logDescriptor.args['dst'].toLowerCase(),
              value: BigInt(logDescriptor.args['wad']).toString(),
              type: AssetType.ERC20,
            });
            break;
        }
        continue;
      }
    }
    // decode log by erc20 transfer event
    logDescriptor = decodeLog(
      ERC20_TRANSFER_EVENT,
      log.data as Hex,
      log.topics as EventLogTopics,
    );
    if (logDescriptor) {
      txAssetTransfers.push({
        contract: log.address,
        from: logDescriptor.args['from'].toLowerCase(),
        to: logDescriptor.args['to'].toLowerCase(),
        value: BigInt(logDescriptor.args['value']).toString(),
        type: AssetType.ERC20,
      });
      continue;
    }
    // decode log by erc721 transfer event
    logDescriptor = decodeLog(
      ERC721_TRANSFER_EVENT,
      log.data as Hex,
      log.topics as EventLogTopics,
    );
    if (logDescriptor) {
      txAssetTransfers.push({
        contract: log.address,
        from: logDescriptor.args['from'].toLowerCase(),
        to: logDescriptor.args['to'].toLowerCase(),
        tokenId: BigInt(logDescriptor.args['tokenId']).toString(),
        type: AssetType.ERC721,
      });
      continue;
    }
    // decode log by old nfts transfer event
    // we detect them as erc20 for now, and will be updated on netAssetTransfersOldNFTs and netAssetTransferCryptopunks
    logDescriptor = decodeLog(
      ERC721_TRANSFER_EVENT_1,
      log.data as Hex,
      log.topics as EventLogTopics,
    );
    if (logDescriptor) {
      txAssetTransfers.push({
        contract: log.address,
        from: logDescriptor.args['from'].toLowerCase(),
        to: logDescriptor.args['to'].toLowerCase(),
        value: BigInt(logDescriptor.args['value']).toString(),
        type: AssetType.ERC20,
      });
      continue;
    }
    // decode log by old nfts transfer event
    // we detect them as erc20 for now, and will be updated on netAssetTransfersOldNFTs and netAssetTransferCryptopunks
    logDescriptor = decodeLog(
      ERC721_TRANSFER_EVENT_2,
      log.data as Hex,
      log.topics as EventLogTopics,
    );
    if (logDescriptor) {
      txAssetTransfers.push({
        contract: log.address,
        from: logDescriptor.args['from'].toLowerCase(),
        to: logDescriptor.args['to'].toLowerCase(),
        value: BigInt(logDescriptor.args['value']).toString(),
        type: AssetType.ERC20,
      });
      continue;
    }
    // decode log by erc1155 transfer event
    logDescriptor = decodeLog(
      ERC1155_TRANSFER_EVENT,
      log.data as Hex,
      log.topics as EventLogTopics,
    );
    if (logDescriptor) {
      switch (logDescriptor.eventName) {
        case 'TransferSingle':
          txAssetTransfers.push({
            contract: log.address,
            from: logDescriptor.args['from'].toLowerCase(),
            to: logDescriptor.args['to'].toLowerCase(),
            tokenId: BigInt(logDescriptor.args['id']).toString(),
            value: BigInt(logDescriptor.args['value']).toString(),
            type: AssetType.ERC1155,
          });
          break;
        case 'TransferBatch':
          const tokenIds = logDescriptor.args['ids'];
          const values = logDescriptor.args['values'];

          for (let tokenIdx = 0; tokenIdx < tokenIds.length; tokenIdx += 1) {
            txAssetTransfers.push({
              contract: log.address,
              from: logDescriptor.args['from'].toLowerCase(),
              to: logDescriptor.args['to'].toLowerCase(),
              tokenId: BigInt(tokenIds[tokenIdx]).toString(),
              value: BigInt(values[tokenIdx]).toString(),
              type: AssetType.ERC1155,
            });
          }
          break;
      }
      continue;
    }
  }

  return txAssetTransfers;
}

export function transform(block: RawBlock): RawBlock {
  block.transactions = block.transactions.map((tx) => {
    // don't count transfers for failed txs
    if (!tx.receipt.status) {
      return tx;
    }

    // first get all of the token transfers from transaction logs
    const tokenTransfers = getTokenTransfers(tx);

    // then group by contract
    const tokenTransfersByContract: Record<string, AssetTransfer[]> = {};
    for (const transfer of tokenTransfers) {
      if (transfer.type !== AssetType.ETH) {
        if (!tokenTransfersByContract[transfer.contract]) {
          tokenTransfersByContract[transfer.contract] = [];
        }
        tokenTransfersByContract[transfer.contract].push(transfer);
      }
    }

    // now prepare a final set of *all* asset transfers (including ETH)
    const assetTransfers: AssetTransfer[] = [];

    // iterate through the traces
    for (const trace of tx.traces) {
      // check for ETH transfers
      if (trace.action.callType !== 'delegatecall') {
        // track contract suicides
        if (
          trace.type === 'suicide' &&
          trace.action.balance &&
          trace.action.balance !== '0x0'
        ) {
          assetTransfers.push({
            from: trace.action.address,
            to: trace.action.refundAddress ?? '',
            type: AssetType.ETH,
            value: BigInt(trace.action.balance).toString(),
          });
        }
        // otherwise track ETH transfers
        else if (trace.action.value && trace.action.value !== '0x0') {
          assetTransfers.push({
            from: trace.action.from,
            to:
              trace.type === 'create'
                ? trace.result.address ?? ''
                : trace.action.to ?? '',
            type: AssetType.ETH,
            value: BigInt(trace.action.value).toString(),
          });
        }
      }

      // check if this is a call to one of our asset transfer contracts
      if (
        trace.action.callType?.endsWith('call') &&
        trace.action.to &&
        tokenTransfersByContract[trace.action.to]?.length > 0
      ) {
        assetTransfers.push(...tokenTransfersByContract[trace.action.to]);
        delete tokenTransfersByContract[trace.action.to];
      }
    }

    if (tokenTransfersByContract[tx.to]?.length > 0) {
      assetTransfers.push(...tokenTransfersByContract[tx.to]);
      delete tokenTransfersByContract[tx.to];
    }

    for (const leftOverTxfers of Object.values(tokenTransfersByContract)) {
      assetTransfers.push(...leftOverTxfers);
    }

    if (assetTransfers.length > 0) {
      tx.assetTransfers = assetTransfers;
    }

    return tx;
  });

  return block;
}
