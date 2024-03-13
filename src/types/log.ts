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
  topic0?: EventLogTopic;
  topic1?: EventLogTopic;
  topic2?: EventLogTopic;
  topic3?: EventLogTopic;
}

export type EventLogTopic = `0x${string}`;

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
  internalType?: string;
  decoded: string;
};
