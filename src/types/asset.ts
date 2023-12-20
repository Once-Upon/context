export enum AssetType {
  ETH = 'eth',
  ERC20 = 'erc20',
  ERC721 = 'erc721',
  ERC1155 = 'erc1155',
}

export type ETHAsset = {
  id: string;
  type: AssetType.ETH;
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

export interface AssetTransfer {
  asset?: string;
  from: string;
  to: string;
  type: AssetType;
  value?: string;
  tokenId?: string;
}
