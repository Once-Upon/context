import { Log } from './log';
import { ContextAction } from './contextAction';

export interface AssetTransfer {
  asset?: string;
  from: string;
  to: string;
  type: 'eth' | 'erc20' | 'erc721' | 'erc1155';
  value?: string;
  tokenId?: string;
}

export type SigHash = {
  from: string;
  to?: string;
  sigHash: string;
};

export type ParamType = {
  name: string;
  type: string;
  baseType: string;
  indexed?: boolean;
  arrayLength: number;
  arrayChildren: ParamType | null;
};

export type TransactionDescription = {
  fragment: {
    name: string;
    type: string;
    inputs: ParamType[];
    outputs: ParamType[];
    constant: boolean;
    stateMutability: 'payable' | 'nonpayable' | 'view' | 'pure';
    payable: boolean;
    gas: null | string;
  };
  name: string;
  args: string[];
  signature: string;
  selector: string;
  value: string;
};

export type Trace = {
  action: {
    callType: string;
    from: string;
    gas: string;
    input: string;
    to: string;
    value: string;
  };
  blockHash: string;
  blockNumber: number;
  result: {
    gasUsed: string;
    output: string;
  };
  subtraces: number;
  traceAddress: number[];
  transactionHash: string;
  transactionPosition: number;
  type: string;
};

export type Receipt = {
  blockHash: string;
  blockNumber: number;
  contractAddress: string | null;
  cumulativeGasUsed: number | string;
  effectiveGasPrice: number | string;
  from: string;
  gasUsed: number | string;
  l1Fee?: string;
  l1FeeScalar?: string;
  l1GasPrice?: string;
  l1GasUsed?: string;
  logsBloom: string;
  status: boolean;
  to: string;
  transactionHash: string;
  transactionIndex: number;
  type: string;
};

export interface Asset {
  asset: string;
  id: string;
  type: 'eth' | 'erc20' | 'erc721' | 'erc1155';
  value?: string;
  tokenId?: string;
}

export interface NetAssetTransfers {
  [address: string]: {
    received: Asset[];
    sent: Asset[];
  };
}

export type TransactionContextType = {
  variables?: ContextVariable;
  summaries?: ContextSummaryType;
  crossChainTx?: Transaction[];
};

export type ContextSummaryVariableType =
  | {
      type: 'emphasis' | 'address' | 'transaction' | 'eth' | 'farcasterID';
      value: string;
    }
  | {
      type: 'contextAction';
      value: ContextAction;
    }
  | {
      type: 'eth' | 'erc20' | 'erc721' | 'erc1155';
      tokenId?: string;
      token: string;
      value?: string;
    }
  | {
      type: 'chainId';
      value: number;
    };

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
  };
};

// MongoDB document
export interface Transaction {
  blockHash: string;
  blockNumber: number;
  from: string;
  gas: number;
  gasPrice: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  hash: string;
  input: string;
  nonce: number;
  to: string;
  transactionIndex: number;
  value: string;
  type: number;
  accessList?: any[];
  chainId: number;
  v: string;
  r: string;
  s: string;
  timestamp: number;
  isoTimestamp: string;
  delegateCalls?: Trace[];
  assetTransfers?: AssetTransfer[];
  sigHash: string;
  internalSigHashes: SigHash[];
  parties: string[];
  decode?: TransactionDescription;
  netAssetTransfers?: NetAssetTransfers;
  receipt?: Receipt;
  context?: TransactionContextType;
  logs?: Log[];
}
