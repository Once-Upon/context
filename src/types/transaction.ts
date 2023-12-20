import { Log } from './log';
import { ContextVariable, ContextSummaryType } from './context';
import { NetAssetTransfers, AssetTransfer } from './asset';

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

export type TransactionContextType = {
  variables?: ContextVariable;
  summaries?: ContextSummaryType;
  crossChainTx?: Transaction[];
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
