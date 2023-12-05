import { ethers } from 'ethers';

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
    inputs: ReadonlyArray<
      Omit<ethers.utils.ParamType, '_isParamType' | 'format'>
    >;
    anonymous: boolean;
  };
  name: string;
  signature: string;
  args: string[];
  topic: string;
};
