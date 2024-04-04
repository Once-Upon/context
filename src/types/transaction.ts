import { Transaction as BaseTransaction, TransactionReceipt } from 'viem';
import { Log, RawReceipt } from './log';
import { ContextVariable, ContextSummaryType } from './context';
import { NetAssetTransfers, AssetTransfer } from './asset';
import { StdObj } from './shared';
import { Contract } from './contract';

export type SigHash = {
  from: string;
  to?: string;
  sigHash: string;
};

export type ParamType = {
  name: string;
  type: string;
  baseType: string;
  indexed?: boolean | null;
  arrayLength: number | null;
  arrayChildren: ParamType | null;
};

export type TransactionMethodArgument = {
  name: string;
  type: string;
  internalType: string;
  decoded: string;
};

export type TransactionDescription = {
  name: string;
  signature: string;
  signature_with_arg_names: string;
  decoded: TransactionMethodArgument[];
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

export type Receipt = TransactionReceipt & {
  l1Fee?: string;
  l1FeeScalar?: string;
  l1GasPrice?: string;
  l1GasUsed?: string;
};

export type TransactionContextType = {
  variables?: ContextVariable;
  summaries?: ContextSummaryType;
  crossChainTx?: Transaction[];
};

// MongoDB document
export type Transaction = BaseTransaction & {
  assetTransfers?: AssetTransfer[];
  sigHash: string;
  internalSigHashes: SigHash[];
  parties: string[];
  decoded?: TransactionDescription;
  netAssetTransfers?: NetAssetTransfers;
  receipt?: Receipt;
  canCopy?: boolean;
  context?: TransactionContextType;
  logs?: Log[];
  timestamp: number;
  isoTimestamp: string;
};

export type RawTransaction = StdObj & {
  accessList?: StdObj[];
  blockNumber: number;
  from: string;
  to: string;
  hash: string;
  input: string;
  chainId: number;
  blockHash: string;
  gas: number;
  nonce: number;
  transactionIndex: number;
  type: number;
  value: string;
  v: string;
  r: string;
  s: string;
  receipt: RawReceipt;
  gasPrice: string;
  traces: RawTrace[];
  contracts?: Contract[];
  decoded?: TransactionDescription;
  context: TxContext;
  assetTransfers: AssetTransfer[];
  netAssetTransfers: NetAssetTransfers;
  errors: string[];
  parties: string[];
  delegateCalls: string[];
  sigHash: string;
  internalSigHashes: InternalSigHash[];
  timestamp: number;
  transactionFee: string;
};

interface InternalSigHash {
  from: string;
  to: string;
  sigHash: string;
}

export type RawTraceAction = StdObj & {
  address: string;
  balance?: string;
  callType?: string;
  from: string;
  refundAddress?: string;
  to?: string;
  value?: string;
  input?: string;
};

export type RawTraceResult = StdObj & {
  address?: string;
  code: string;
  hash: string;
  receipt: StdObj;
  to: string;
  traces: RawTrace[];
  transactionIndex: number;
};

export type RawTrace = StdObj & {
  action: RawTraceAction;
  blockNumber: number;
  blockhash: string;
  error?: string;
  result: RawTraceResult;
  subtraces: number;
  traceAddress: number[];
  transactionHash: string;
  transactionPosition: number;
  type: string;
  decoded?: TransactionDescription;
};

export type TxContext = {
  type: string;
};
