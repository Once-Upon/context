import { Transaction as BaseTransaction } from 'viem';
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
  indexed?: boolean | null;
  arrayLength: number | null;
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
  to: string | null;
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
export type Transaction = BaseTransaction & {
  assetTransfers?: AssetTransfer[];
  sigHash: string;
  internalSigHashes: SigHash[];
  parties: string[];
  decode?: TransactionDescription;
  netAssetTransfers?: NetAssetTransfers;
  receipt?: Receipt;
  canCopy?: boolean;
  context?: TransactionContextType;
  logs?: Log[];
};
