import {
  Address,
  Transaction as BaseTransaction,
  Hash,
  Hex,
  TransactionReceipt,
} from 'viem';
import { Log, RawReceipt } from './log';
import { ContextVariable, ContextSummaryType } from './context';
import { NetAssetTransfers, AssetTransfer } from './asset';
import { InternalHashType, StdObj } from './shared';
import { Contract } from './contract';
import { ContextAction } from './contextAction';

export type SigHash = {
  from: Address;
  to?: Address;
  sigHash: Hash;
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
    from: Address;
    gas: string;
    input: Hex;
    to: Address;
    value: string;
  };
  blockHash: Hash;
  blockNumber: bigint;
  result: {
    gasUsed: string;
    output: string;
  };
  subtraces: number;
  traceAddress: number[];
  transactionHash: Hash;
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
  actions?: ContextAction[];
};

// MongoDB document
export type Transaction = BaseTransaction & {
  assetTransfers?: AssetTransfer[];
  pseudotransactions?: PseudoTransaction[];
  sigHash: string;
  internalSigHashes: SigHash[];
  parties: string[];
  decoded?: TransactionDescription;
  netAssetTransfers?: NetAssetTransfers;
  receipt?: Receipt;
  canCopy?: boolean;
  context?: TransactionContextType;
  logs?: Log[];
  delegateCalls: RawTrace[];
  timestamp: number;
  isoTimestamp: string;
};

export type TurboTransaction = BaseTransaction & {
  assetTransfers?: AssetTransfer[];
  pseudotransactions?: PseudoTransaction[];
  sigHash: string;
  internalSigHashes: SigHash[];
  parties: string[];
  decoded?: TransactionDescription;
  netAssetTransfers?: NetAssetTransfers;
  receipt?: Receipt;
  canCopy?: boolean;
  contextCached?: TransactionContextType;
  logs?: Log[];
  delegateCalls: RawTrace[];
  timestamp: number;
  isoTimestamp: string;
  contextActions: ContextAction[];
  contextActionSpecific: ContextAction;
  contextActionGeneric: ContextAction;
};

export type PartialTransaction = Omit<BaseTransaction, 'hash'> & {
  receipt: RawReceipt;
  traces: RawTrace[];

  // From transformers
  contracts?: Contract[];
  decoded?: TransactionDescription;
  context: TxContext;
  assetTransfers: AssetTransfer[];
  netAssetTransfers: NetAssetTransfers;
  logs?: Log[];
  errors: string[];
  parties?: string[];
  neighbor?: RawNeighbor;
  sigHash?: string;
  internalSigHashes?: InternalHashType[];
  timestamp?: number;
  delegateCalls?: RawTrace[];
  baseFeePerGas?: string | number;
  transactionFee?: string;
};

export type PseudoTransaction = PartialTransaction & {
  meta: {
    type: 'ERC4337';
    key: string;
  } & Record<string, any>;
};

export type RawTransaction = PartialTransaction & {
  hash: Hex;
  accessList?: StdObj[];

  pseudoTransactions?: PseudoTransaction[];
};

export type RawTraceAction = StdObj & {
  address: Address;
  balance?: string;
  callType?: string;
  from: Address;
  refundAddress?: string;
  to?: Address;
  value?: string;
  input?: Hex;
};

export type RawTraceResult = StdObj & {
  address?: Address;
  code: string;
  hash: Hash;
  receipt: StdObj;
  to: Address;
  traces: RawTrace[];
  transactionIndex: number;
};

export type RawTrace = StdObj & {
  action: RawTraceAction;
  blockNumber: number;
  blockHash: Hash;
  error?: string;
  result: RawTraceResult;
  subtraces: number;
  traceAddress: Address[];
  transactionHash: Hash;
  transactionPosition: number;
  type: string;
  decoded?: TransactionDescription;
};

export type RawNeighbor = {
  address: Address;
  neighbor: string;
};

export type TxContext = {
  type: string;
};
