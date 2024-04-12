/* eslint-disable @typescript-eslint/no-unsafe-call */
import {
  AssetType,
  ERC1155AssetTransfer,
  ERC721AssetTransfer,
  type RawBlock,
} from '../../types';

export function transform(block: RawBlock): RawBlock {
  block.transactions = block.transactions.map((tx) => {
    // from/to addresses
    let parties: string[] = [];
    if (tx.from) {
      parties = [...parties, tx.from.toLowerCase()];
    }
    if (tx.to) {
      parties = [...parties, tx.to.toLowerCase()];
    }
    // address from input data
    const inputAddresses: string[] = tx.decoded
      ? tx.decoded.decoded
          .map((param) =>
            param.type === 'address' && param.decoded
              ? param.decoded.toLowerCase()
              : '',
          )
          .filter((address) => address !== '')
      : [];
    // addresses from traces
    const traceParties = tx.traces.map((trace) => {
      let result: string[] = [];
      if (trace.action?.from) {
        result = [...result, trace.action.from.toLowerCase()];
      }
      if (trace.action?.to) {
        result = [...result, trace.action.to.toLowerCase()];
      }
      if (trace.type === 'suicide') {
        result = [...result, trace.action.address.toLowerCase()];
        if (trace.action.refundAddress) {
          result = [...result, trace.action.refundAddress.toLowerCase()];
        }
      }
      // grab event inputs params from decoded trace
      const partiesFromTrace = trace.decoded?.decoded
        .map((param) =>
          param.type === 'address' && param.decoded
            ? param.decoded.toLowerCase()
            : '',
        )
        .filter((address) => address !== '');

      if (partiesFromTrace && partiesFromTrace.length > 0) {
        result = [...result, ...partiesFromTrace];
      }
      return result;
    });
    // addresses from logs
    const logParties = tx.receipt.logs.map((log) => {
      let result = [log.address.toLowerCase()];
      // grab event inputs params from decoded log
      const partiesFromLog = log.decoded?.decoded
        .map((param) =>
          param.type === 'address' && param.decoded
            ? param.decoded.toLowerCase()
            : '',
        )
        .filter((address) => address !== '');

      if (partiesFromLog && partiesFromLog.length > 0) {
        result = [...result, ...partiesFromLog];
      }
      return result;
    });
    // nfts
    const nftTransfers = tx.assetTransfers?.filter(
      (transfer) =>
        transfer.type === AssetType.ERC721 ||
        transfer.type === AssetType.ERC1155,
    ) as (ERC1155AssetTransfer | ERC721AssetTransfer)[];
    const nfts = nftTransfers
      ? nftTransfers.map(
          (transfer) =>
            `${transfer.contract.toLowerCase()}-${transfer.tokenId}`,
        )
      : [];
    // contracts created
    const contractsCreated = tx.contracts?.map((contract) => contract.address);
    parties = [
      ...parties,
      ...traceParties.flat(),
      ...logParties.flat(),
      ...nfts.flat(),
    ];
    if (inputAddresses && inputAddresses.length > 0) {
      parties = [...parties, ...inputAddresses];
    }
    if (contractsCreated && contractsCreated.length > 0) {
      parties = [...parties, ...contractsCreated];
    }

    tx.parties = [...new Set(parties)].filter((party) => party);

    return tx;
  });

  return block;
}
