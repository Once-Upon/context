export enum AssetType {
  ETH = 'eth',
  DEGEN = 'degen',
  ERC20 = 'erc20',
  ERC721 = 'erc721',
  ERC1155 = 'erc1155',
}

export type ETHAsset = {
  id: string;
  type: AssetType.ETH;
  value: string;
};

// Other native currencies
export type DEGENAsset = {
  id: string;
  type: AssetType.DEGEN;
  value: string;
};

export interface ERC20Asset {
  id: string;
  asset: string;
  type: AssetType.ERC20;
  value: string;
}

export interface ERC721Asset {
  asset: string;
  id: string;
  type: AssetType.ERC721;
  tokenId: string;
}

export interface ERC1155Asset {
  asset: string;
  id: string;
  type: AssetType.ERC1155;
  value: string;
  tokenId: string;
}

export type Asset = ETHAsset | ERC20Asset | ERC721Asset | ERC1155Asset;

export interface NetAssetTransfers {
  [address: string]: {
    received: Asset[];
    sent: Asset[];
  };
}

export type ETHAssetTransfer = {
  type: AssetType.ETH;
  value: string;
  from: string;
  to: string;
};

export interface ERC20AssetTransfer {
  asset: string;
  type: AssetType.ERC20;
  value: string;
  from: string;
  to: string;
}

export interface ERC721AssetTransfer {
  asset: string;
  type: AssetType.ERC721;
  tokenId: string;
  from: string;
  to: string;
}

export interface ERC1155AssetTransfer {
  asset: string;
  type: AssetType.ERC1155;
  value: string;
  tokenId: string;
  from: string;
  to: string;
}

export type AssetTransfer =
  | ETHAssetTransfer
  | ERC20AssetTransfer
  | ERC721AssetTransfer
  | ERC1155AssetTransfer;
