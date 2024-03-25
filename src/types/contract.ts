import { StdObj } from './shared';
import { ABI } from './abi';

export type Contract = {
  chainId?: number;
  deployer: string;
  directDeployer: string;
  address: string;
  bytecode: string;
  fingerprint: string;
  gas: unknown; // TOOD - do we convert with bignumber here?
  gasUsed: unknown; // TODO - do we convert with bignumber here?
  blockNumber: number;
  transactionHash: string;
  type: 'create' | 'create2';
  metadata: ContractMetadata;
  supportedInterfaces?: SupportedInterfaces;
  sigHash: string;
  internalSigHashes: string[];
  transactionIndex: number;
  traceIndex: number;
  ethTransfer: boolean;
  timestamp: number;
  isoTimestamp: string;
};

export type ContractMetadata = {
  isUniswapV3: boolean;
  isUniswapV2: boolean;
  isUniswapV1: boolean;
  uniswapPairs: string[];
  isPropHouseToken: boolean;
  isPropHouseMetadata: boolean;
  isPropHouseAuction: boolean;
  isPropHouseTreasury: boolean;
  isPropHouseGovernor: boolean;
  isGenericGovernance: boolean;
  isGnosisSafe: boolean;

  alchemy?: StdObj;
  coingecko?: StdObj;
  etherscan?: StdObj;
  opensea?: StdObj;
  simplehash?: StdObj;
  tally?: TallyMetadata;
  whatsAbiSelectors: string[];
  whatsAbiAbi: ABI;
  isProxy: boolean;
  implementationAddress?: string;
  tokenMetadata: TokenMetadata;
};

export type SupportedInterfaces = Record<string, boolean>;

export type TallyMetadata = {
  type: string;
  name: string;
  quorum: string;
  timelockId: string;
  parameters: {
    quorumVotes: string;
    proposalThreshold: string;
    votingDelay: string;
    votingPeriod: string;
    quorumNumerator: string;
    quorumDenominator: string;
  };
  proposalStats: {
    total: number;
    active: number;
    failed: number;
    passed: number;
  };
  tokens: [
    {
      id: string;
      type: string;
      address: string;
      name: string;
      symbol: string;
      supply: string;
      lastBlock: number;
      decimals: number;
    },
  ];
  slug: string;
};

export type TokenStandard = 'erc20' | 'erc721' | 'erc777' | 'erc1155' | '';

export type TokenMetadata = {
  tokenStandard: TokenStandard;
  name?: string;
  symbol?: string;
  decimals?: number;
};

export type PropHouseDao = {
  token: string;
  metadata: string;
  auction: string;
  treasury: string;
  governor: string;
};
