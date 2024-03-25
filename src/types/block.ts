import { StdObj } from './shared';
import { RawTransaction } from './transaction';
import { Contract } from './contract';

export type RawBlock = StdObj & {
  chainId: number;
  gasUsed: string;
  gasLimit: string;
  baseFeePerGas: number | string;
  number: number;
  timestamp: number;
  transactions: RawTransaction[];
  contracts: Contract[];
  transactionCount: number;
  transactionHashes: string[];
};
