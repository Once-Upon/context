import {
  type RawBlock,
  type NetAssetTransfers,
  type Asset,
  AssetType,
  ERC1155Asset,
  ERC20Asset,
  ETHAsset,
  AssetTransfer,
} from '../../types';

export function extractNetAssetTransfers(
  assetTransfers: AssetTransfer[],
): NetAssetTransfers {
  const assetsById: Record<string, Asset> = {};
  const netAssetsByAddress: Record<string, Record<string, bigint>> = {};

  for (const assetTransfer of assetTransfers) {
    if (
      assetTransfer.from === assetTransfer.to ||
      !assetTransfer.from ||
      !assetTransfer.to
    ) {
      continue;
    }

    let asset: Asset | undefined = undefined;
    let assetValue = BigInt(0);
    let assetId = '';
    switch (assetTransfer.type) {
      case 'erc721':
        asset = {
          contract: assetTransfer.contract,
          tokenId: assetTransfer.tokenId,
          type: assetTransfer.type,
        };
        assetValue = BigInt(1);
        assetId = `${assetTransfer.contract}-${assetTransfer.tokenId}`;
        break;
      case 'erc1155':
        asset = {
          contract: assetTransfer.contract,
          tokenId: assetTransfer.tokenId,
          type: assetTransfer.type,
          value: assetTransfer.value,
        };
        assetValue = BigInt(assetTransfer.value);
        assetId = `${assetTransfer.contract}-${assetTransfer.tokenId}`;
        break;
      case 'erc20':
        asset = {
          contract: assetTransfer.contract,
          type: assetTransfer.type,
          value: assetTransfer.value,
        };
        assetValue = BigInt(assetTransfer.value);
        assetId = `${assetTransfer.contract}`;
        break;
      case 'eth':
        asset = {
          type: assetTransfer.type,
          value: assetTransfer.value,
        };
        assetValue = BigInt(assetTransfer.value);
        assetId = 'eth';
        break;
    }

    if (!asset || !assetId) {
      continue;
    }

    if (!netAssetsByAddress[assetTransfer.from]) {
      netAssetsByAddress[assetTransfer.from] = {};
    }
    if (!netAssetsByAddress[assetTransfer.to]) {
      netAssetsByAddress[assetTransfer.to] = {};
    }
    if (!netAssetsByAddress[assetTransfer.from][assetId]) {
      netAssetsByAddress[assetTransfer.from][assetId] = BigInt(0);
    }
    if (!netAssetsByAddress[assetTransfer.to][assetId]) {
      netAssetsByAddress[assetTransfer.to][assetId] = BigInt(0);
    }

    assetsById[assetId] = asset;
    netAssetsByAddress[assetTransfer.from][assetId] =
      netAssetsByAddress[assetTransfer.from][assetId] - BigInt(assetValue);
    netAssetsByAddress[assetTransfer.to][assetId] =
      netAssetsByAddress[assetTransfer.to][assetId] + BigInt(assetValue);
  }

  const netAssetTransfers: NetAssetTransfers = {};
  for (const [address, assets] of Object.entries(netAssetsByAddress)) {
    for (const [id, value] of Object.entries(assets)) {
      if (value === BigInt(0)) {
        continue;
      }

      if (!netAssetTransfers[address]) {
        netAssetTransfers[address] = { received: [], sent: [] };
      }

      const type = assetsById[id].type;
      let assetTransferred: Asset = {
        type: AssetType.ETH,
        value: '',
      };

      if (type === AssetType.ERC721) {
        assetTransferred = {
          ...assetsById[id],
        };
      } else {
        switch (assetsById[id].type) {
          case AssetType.ERC1155:
            assetTransferred = assetsById[id] as ERC1155Asset;
            assetTransferred.value =
              value > BigInt(0)
                ? value.toString()
                : (value * BigInt(-1)).toString();
            break;
          case AssetType.ERC20:
            assetTransferred = assetsById[id] as ERC20Asset;
            assetTransferred.value =
              value > BigInt(0)
                ? value.toString()
                : (value * BigInt(-1)).toString();
            break;
          case AssetType.ETH:
            assetTransferred = assetsById[id] as ETHAsset;
            assetTransferred.value =
              value > BigInt(0)
                ? value.toString()
                : (value * BigInt(-1)).toString();
            break;
        }
      }

      if (value < BigInt(0)) {
        netAssetTransfers[address].sent.push({ ...assetTransferred });
      } else {
        netAssetTransfers[address].received.push({ ...assetTransferred });
      }
    }
  }

  if (Object.keys(netAssetTransfers).length > 0) {
    return netAssetTransfers;
  }

  return {};
}

export function transform(block: RawBlock): RawBlock {
  block.transactions = block.transactions.map((tx) => {
    const assetTransfers = tx.assetTransfers;
    if (!assetTransfers?.length) {
      return tx;
    }

    tx.netAssetTransfers = extractNetAssetTransfers(assetTransfers);

    return tx;
  });

  return block;
}
