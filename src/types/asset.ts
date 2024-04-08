export enum AssetType {
  ETH = 'eth',
  DEGEN = 'degen',
  ERC20 = 'erc20',
  ERC721 = 'erc721',
  ERC1155 = 'erc1155',
}

export type NativeTokenType = 'eth' | 'degen';

export type ETHAsset = {
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
  contract: string;
  type: AssetType.ERC20;
  value: string;
}

export interface ERC721Asset {
  contract: string;
  type: AssetType.ERC721;
  tokenId: string;
}

export interface ERC1155Asset {
  contract: string;
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
  contract: string;
  type: AssetType.ERC20;
  value: string;
  from: string;
  to: string;
}

export interface ERC721AssetTransfer {
  contract: string;
  type: AssetType.ERC721;
  tokenId: string;
  from: string;
  to: string;
}

export interface ERC1155AssetTransfer {
  contract: string;
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
