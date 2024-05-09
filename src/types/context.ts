import { ContextAction } from './contextAction';
import { AssetType } from './asset';

export type ContextStringType = {
  type: 'string';
  value: string;
  indexed?: boolean;
  emphasis?: boolean;
  truncate?: boolean;
  unit?: string;
};

export type ContextArrayType = {
  type: 'array';
  value: string[] | number[];
  unit?: string;
};

export type ContextHexType = {
  type: 'address' | 'transaction' | 'farcasterID' | 'crosschain';
  value: string;
  indexed?: boolean;
  emphasis?: boolean;
};

export type ContextCodeType = {
  type: 'code';
  value: string;
};

export type ContextActionType = {
  type: 'contextAction';
  value: ContextAction;
  indexed?: boolean;
  emphasis?: boolean;
};

export type ContextERC20Type = {
  type: AssetType.ERC20;
  token: string;
  value: string;
  indexed?: boolean;
  emphasis?: boolean;
};

export type ContextERC721Type = {
  type: AssetType.ERC721;
  tokenId: string;
  token: string;
  indexed?: boolean;
  emphasis?: boolean;
};

export type ContextMultipleERC721Type = {
  type: AssetType.ERC721;
  token: string;
  indexed?: boolean;
  emphasis?: boolean;
};

export type ContextERC1155Type = {
  type: AssetType.ERC1155;
  tokenId: string;
  token: string;
  value: string;
  indexed?: boolean;
  emphasis?: boolean;
};

export type ContextMultipleERC71155Type = {
  type: AssetType.ERC1155;
  token: string;
  indexed?: boolean;
  emphasis?: boolean;
};

export type ContextETHType = {
  type: AssetType.ETH;
  value: string;
  indexed?: boolean;
  emphasis?: boolean;
  unit: string;
};

export type ContextChainIDType = {
  type: 'chainID';
  value: number;
  indexed?: boolean;
  emphasis?: boolean;
};

export type ContextNumberType = {
  type: 'number';
  value: number;
  indexed?: boolean;
  emphasis?: boolean;
  unit?: string; // nonce is an example where there is no unit
};

export type ContextLinkType = {
  type: 'link';
  value: string;
  truncate?: boolean;
  link: string;
};

export type ContextReferrerType = {
  type: 'referrer';
  value: string;
  rawValue: string;
  indexed?: boolean;
  emphasis?: boolean;
};

export type ContextSummaryVariableType =
  | ContextStringType
  | ContextArrayType
  | ContextHexType
  | ContextCodeType
  | ContextActionType
  | ContextERC20Type
  | ContextERC721Type
  | ContextMultipleERC721Type
  | ContextERC1155Type
  | ContextMultipleERC71155Type
  | ContextETHType
  | ContextChainIDType
  | ContextNumberType
  | ContextLinkType
  | ContextReferrerType;

export type ContextVariable = {
  [key: string]: ContextSummaryVariableType;
};

export type ContextSummaryType = {
  category?:
    | 'MULTICHAIN'
    | 'FUNGIBLE_TOKEN'
    | 'NFT'
    | 'IDENTITY'
    | 'CORE'
    | 'OTHER'
    | 'DEV'
    | 'GOVERNANCE'
    | 'MULTISIG'
    | 'ACCOUNT_ABSTRACTION'
    | 'PROTOCOL_1'
    | 'PROTOCOL_2'
    | 'PROTOCOL_3'
    | 'PROTOCOL_4'
    | 'PROTOCOL_5'
    | 'UNKNOWN';
  en: {
    title: string;
    default: string;
    variables?: ContextVariable;
    long?: string;
  };
};
