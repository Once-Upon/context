import { Log as BaseLog } from 'viem';
import { StdObj } from './shared';

export type Log = BaseLog & {
  chainId: number;
  decoded?: LogDescription;
  topic0: string;
  topic1: string;
  topic2: string;
  topic3: string;
};

export type EventArgument = {
  indexed: boolean;
  name: string;
  type: string;
  decoded: string;
};

export type LogDescription = {
  name: string;
  signature: string;
  signature_with_arg_names: string;
  decoded: EventArgument[];
};

export type EventLogTopics = [
  signature: `0x${string}`,
  ...args: `0x${string}`[],
];

export type RawLog = BaseLog & {
  decoded?: LogDescription;
};

export type RawReceipt = StdObj & {
  logs: RawLog[];
  gasUsed: number | string;
  effectiveGasPrice: number | string;
  l1GasPrice?: string;
  l1GasUsed?: string;
  l1FeeScalar?: string;
};
