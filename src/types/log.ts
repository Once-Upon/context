export interface Log {
  address: string;
  data: string;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;
  chainId: number;
  decoded?: LogDescription;
  topic0: string;
  topic1: string;
  topic2: string;
  topic3: string;
}

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
