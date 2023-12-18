import { ParamType } from './transaction';

export interface Log {
  address: string;
  topics: string[];
  data: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;
  chainId: number;
  decode?: LogDescription;
}

export type LogDescription = {
  fragment: {
    name: string;
    type: string;
    inputs: ReadonlyArray<ParamType>;
    anonymous: boolean;
  };
  name: string;
  signature: string;
  args: string[];
  topic: string;
};

export type EventLogTopics = [
  signature: `0x${string}`,
  ...args: `0x${string}`[],
];
