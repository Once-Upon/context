import { Contract } from './contract';
import { AssetTransfer } from './asset';

export type StdObj = Record<string, unknown>;

/** ABI */

export type AbiType =
  | 'function'
  | 'constructor'
  | 'event'
  | 'fallback'
  | 'receive';
export type StateMutabilityType = 'pure' | 'view' | 'nonpayable' | 'payable';

export interface AbiItem {
  anonymous?: boolean;
  constant?: boolean;
  inputs?: AbiInput[];
  name?: string;
  outputs?: AbiOutput[];
  payable?: boolean;
  stateMutability?: StateMutabilityType;
  type: AbiType;
  gas?: number;
}

export interface AbiInput {
  name: string;
  type: string;
  indexed?: boolean;
  components?: AbiInput[];
  internalType?: string;
}

export interface AbiOutput {
  name: string;
  type: string;
  components?: AbiOutput[];
  internalType?: string;
}

export type TransactionContract = {
  hash: string;
  contracts: Contract[];
};

export type transactionAssetTransfers = {
  hash: string;
  assetTransfers: AssetTransfer[];
};

export type InternalHashType = {
  sigHash: string;
  from: string;
  to?: string;
};

export type TransactionWithHash = {
  hash: string;
  sigHash: string;
  internalSigHashes: InternalHashType[];
};

export type FragmentType =
  | 'constructor'
  | 'error'
  | 'event'
  | 'fallback'
  | 'function'
  | 'struct';
