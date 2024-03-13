import { ParamType } from './transaction';

export interface Log {
  address: string;
  data: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;
  decoded?: LogDescription | null;
  topic0?: string;
  topic1?: string;
  topic2?: string;
  topic3?: string;
}

export type LogDescription = {
  name: string;
  signature: string;
  signature_with_arg_names: string;
  decoded: LogArgument[];
};

export type LogArgument = {
  indexed: boolean;
  name: string;
  type: string;
  internalType: string;
  decoded: string;
};
