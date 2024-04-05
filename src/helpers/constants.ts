import 'dotenv/config';
import { AbiItem } from '../types';

export const WETH_ADDRESSES = [
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // Ethereum
  '0x4200000000000000000000000000000000000006', // OP Stack
  '0xe5d7c2a44ffddf6b295a15c148167daaaf5cf34f', // Linea
  '0x0000000000a39bb272e79075ade125fd351887ac', // Blur
];

export const KNOWN_ADDRESSES = {
  CryptoKitties: '0x06012c8cf97bead5deae237070f9587f8e7a266d', // Meow
  CryptoPunksNew: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
  CryptoPunksOld: '0x6ba6f2207e343923ba692e5cae646fb0f566db8d',
  CryptoStrikers: '0xdcaad9fd9a74144d226dbf94ce6162ca9f09ed7e',
  NULL: '0x0000000000000000000000000000000000000000',
  WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
};

export const CHAIN_IDS = {
  base: 8453,
  base_goerli: 84531,
  base_sepolia: 84532,
  eth_goerli: 5,
  ethereum: 1,
  linea: 59144,
  lyra_sepolia: 901,
  mode_sepolia: 919,
  op_goerli: 420,
  op_sepolia: 11155420,
  optimism: 10,
  orderly_sepolia: 4460,
  pgn_sepolia: 58008,
  public_goods_network: 424,
  zora: 7777777,
  zora_goerli: 999,
  zora_sepolia: 999999999,
};

export const FORKS = {
  frontier: 0, // July 30, 2015: https://ethereum.org/en/history/#frontier
  frontier_thawing: 200000, // September 7, 2015: https://ethereum.org/en/history/#frontier-thawing
  homestead: 1150000, // March 14, 2016: https://ethereum.org/en/history/#homestead
  dao_fork: 1920000, // July 20, 2016: https://ethereum.org/en/history/#dao-fork
  tangerine_whistle: 2463000, // October 18, 2016: https://ethereum.org/en/history/#tangerine-whistle
  spurious_dragon: 2675000, // November 22, 2016: https://ethereum.org/en/history/#spurious-dragon
  byzantium: 4370000, // October 16, 2017: https://ethereum.org/en/history/#byzantium
  constantinople: 7280000, // February 28, 2019: https://ethereum.org/en/history/#constantinople
  istanbul: 9069000, // December 8, 2019: https://ethereum.org/en/history/#istanbul
  muir_glacier: 9200000, // January 2, 2020: https://ethereum.org/en/history/#muir-glacier
  berlin: 1244000, // April 15, 2021: https://ethereum.org/en/history/#berlin
  london: 12965000, // August 05, 2021: https://ethereum.org/en/history/#london
  arrow_glacier: 13773000, // December 9, 2021: https://ethereum.org/en/history/#arrow-glacier
  gray_glacier: 15050000, // June 30, 2022: https://ethereum.org/en/history/#gray-glacier
  paris: 15537394, // September 15, 2022: https://ethereum.org/en/history/#paris
  shanghai: 17034870, // April 12, 2023: https://ethereum.org/en/history/#shanghai
};

// https://eips.ethereum.org/EIPS/eip-20
export const ERC20_METHOD_SIGNATURES = [
  'totalSupply()',
  'balanceOf(address)',
  'transfer(address,uint256)',
  'transferFrom(address,address,uint256)',
  'approve(address,uint256)',
  'allowance(address,address)',
];

// https://eips.ethereum.org/EIPS/eip-777
export const ERC777_METHOD_SIGNATURES = [
  'totalSupply()',
  'balanceOf(address)',
  'granularity()',
  'defaultOperators()',
  'isOperatorFor(address,address)',
  'authorizeOperator(address)',
  'revokeOperator(address)',
  'send(address,uint256,bytes)',
  'operatorSend(address,address,uint256,bytes,bytes)',
  'burn(uint256,bytes)',
  'operatorBurn(address,uint256,bytes,bytes)',
];

// TODO - ERC721_OLD_METHOD_SIGNATURES (e.g. CryptoKitties, CryptoStrikers, CryptoArte, etc.)

// https://ethereum.org/en/developers/docs/standards/tokens/erc-721/#methods
export const ERC721_METHOD_SIGNATURES = [
  'balanceOf(address)',
  'ownerOf(uint256)',
  'safeTransferFrom(address,address,uint256,bytes)',
  'safeTransferFrom(address,address,uint256)',
  'transferFrom(address,address,uint256)',
  'approve(address,uint256)',
  'setApprovalForAll(address,bool)',
  'getApproved(uint256)',
  'isApprovedForAll(address,address)',
];

// NOTE - ERC721a implements ERC721, so we don't need to include ERC721a methods here https://www.azuki.com/erc721a

// https://eips.ethereum.org/EIPS/eip-1155
export const ERC1155_METHOD_SIGNATURES = [
  // TODO - For some reason balanceOf(address,uint256) is not showing up in the bytecode for erc1155s
  // balanceOf(address,uint256),
  'balanceOfBatch(address[],uint256[])',
  'setApprovalForAll(address,bool)',
  'isApprovedForAll(address,address)',
  'safeTransferFrom(address,address,uint256,uint256,bytes)',
  'safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)',
];

//https://eips.ethereum.org/EIPS/eip-165
export const ERC165_METHOD_SIGNATURES = ['supportsInterface(bytes4)'];

// Contract Addresses
export const OPENSEA_REGISTRY_SIGNATURES = ['registerProxy()'];

export const OPENSEA_REGISTRY_ADDRESS =
  '0xa5409ec958c83c3f309868babaca7c86dcb077c1';

// Gnosis Safe
export const GNOSIS_SAFE_FACTORY_METHOD_SIGNATURES = [
  'createProxy(address,bytes)',
  'createProxyWithNonce(address,bytes,uint256)',
  'createProxyWithCallback(address,bytes,uint256,address)',
];

export const GNOSIS_SAFE_FACTORY_0_1_0_ADDRESS =
  '0x88cd603a5dc47857d02865bbc7941b588c533263'; // Not used often
export const GNOSIS_SAFE_FACTORY_1_0_0_ADDRESS =
  '0x12302fe9c02ff50939baaaaf415fc226c078613c'; // This release appears to have been buggy and didn't deploy contracts often
export const GNOSIS_SAFE_FACTORY_1_0_1_ADDRESS =
  '0x50e55af101c777ba7a1d560a774a82ef002ced9f'; // Not used often
export const GNOSIS_SAFE_FACTORY_1_1_1_ADDRESS =
  '0x76e2cfc1f5fa8f6a5b3fc4c8f4788f0116861f9b';
export const GNOSIS_SAFE_FACTORY_1_3_0_ADDRESS =
  '0xa6b71e26c5e0845f74c812102ca7114b6a896ab2';

// https://eips.ethereum.org/EIPS/eip-1967
export const TRANSPARENT_UPGRADEABLE_PROXY_EVENT_SIGNATURES = [
  'Upgraded(address)',
];

export const ERC20ABI: AbiItem[] = [
  {
    name: 'name',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    name: 'symbol',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    name: 'decimals',
    inputs: [],
    outputs: [{ name: '', type: 'uint8' }],
    type: 'function',
  },
];

export const ERC721ABI: AbiItem[] = [
  {
    name: 'name',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
  {
    name: 'symbol',
    inputs: [],
    outputs: [{ name: '', type: 'string' }],
    type: 'function',
  },
];

export const ERC165ABI: AbiItem[] = [
  {
    constant: true,
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
];

export const ERC165_CHECK_INPUTS = [
  '0x01ffc9a701ffc9a700000000000000000000000000000000000000000000000000000000',
  '0x01ffc9a7ffffffff00000000000000000000000000000000000000000000000000000000',
];

export const INTERFACE_IDS = {
  ERC1967: '0x2a55205a',
  ERC721: '0x80ac58cd',
  ERC165: '0x01ffc9a7',
  ERC875: '0x553e757e',
  ERC721Metadata: '0x5b5e139f',
  ERC20: '0xb7799584',
  ERC721Enumerable: '0x780e9d63',
  ERC1155: '0xbb3bafd6',
  ERC721BatchTransfer: '0xd9b67a26',
  ERC777: '0x1890fe8e',
  ERC721MetadataMintable: '0x7d248440',
  ERC998: '0xec5f752e',
  ERC1654: '0x1626ba7e',
  ERC223: '0xc169902c',
  ERC2981: '0x9385547e',
  ERC721Pausable: '0x7a63aa3a',
  ERC20Burnable: '0x40c1a064',
  ERC20Mintable: '0xff5e34e7',
  ERC721Burnable: '0xa1a3cd2a',
  ERC1651: '0x54fd4d50',
  ERC777TokensSender: '0xa920b78c',
  ERC777TokensRecipient: '0x9a20483d',
};

export const GENERIC_GOVERNANCE_INTERFACES = [
  '0xbf26d897',
  '0x79dd796f',
  '0x3938f78a',
];

export const UNISWAP_V3_FACTORY = '0x1f98431c8ad98523631ae4a59f267346ea31f984';
export const UNISWAP_V2_FACTORY = '0x5c69bee701ef814a2b6a3edd4b1652cb9cc5aa6f';
export const UNISWAP_V1_FACTORY = '0xc0a47dfe034b400b47bdad5fecda2621de6c4d95';
export const PROP_HOUSE_PROXY_CONTRACT =
  '0xd310a3041dfcf14def5ccbc508668974b5da7174';
export const PROP_HOUSE_IMPLEMENTATION_CONTRACT =
  '0x138d8aef5cbbbb9ea8da98cc0847fe0f3b573b40';

export const UNISWAP_V3_POOL_CREATED_EVENT_HASH =
  '0x783cca1c0412dd0d695e784568c96da2e9c22ff989357a2e8b1d9b2b4e6b7118';
export const UNISWAP_V2_PAIR_CREATED_EVENT_HASH =
  '0x0d3648bd0f6ba80134a33ba9275ac585d9d315f0ad8355cddefde31afa28d0e9';
export const UNISWAP_V1_NEW_EXCHANGE_EVENT_HASH =
  '0x9d42cb017eb05bd8944ab536a8b35bc68085931dd5f4356489801453923953f9';

export const UNISWAP_V1_NEW_EXCHANGE_EVENT =
  'event NewExchange(address,address)';
export const UNISWAP_V2_PAIR_CREATED_EVENT =
  'event PairCreated(address indexed token0, address indexed token1, address pair, uint)';
export const UNISWAP_V3_POOL_CREATED_EVENT =
  'event PoolCreated(address indexed token0, address indexed token1, uint24 indexed fee, int24 tickSpacing, address pool)';

export const PROP_HOUSE_DAO_DEPLOYED_EVENT_HASH =
  '0x456d2baf5a87d70e586ec06fb91c2d7849778dd41d80fa826a6ea5bf8d28e3a6';
export const PROP_HOUSE_DAO_DEPLOYED_EVENT =
  'event DAODeployed(address,address,address,address,address)';

// https://docs.openzeppelin.com/contracts/4.x/api/governance#IGovernor
export const GOVERNOR_METHOD_SIGNATURES = [
  'name()',
  'version()',
  'COUNTING_MODE()',
  'hashProposal(address[],uint256[],bytes[],bytes32)',
  'state(uint256)',
  'proposalSnapshot(uint256)',
  'proposalDeadline(uint256)',
  'votingDelay()',
  'votingPeriod()',
  'quorum(uint256)',
  'getVotes(address,uint256)',
  'hasVoted(uint256,address)',
  'propose(address[],uint256[],bytes[],string)',
  'execute(address[],uint256[],bytes[],bytes32)',
  'castVote(uint256,uint8)',
  'castVoteWithReason(uint256,uint8,string)',
  'castVoteBySig(uint256,uint8,uint8,bytes32,bytes32)',
];

export const TOKEN_SWAP_CONTRACTS = [
  '0xe592427a0aece92de3edee1f18e0157c05861564', // Uniswap V3 Router
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45', // Uniswap V3router2
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d', // Uniswap V2 Router2
  '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b', // Uniswap Universal Router
  '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f', // Sushiswap Router
  '0x1111111254fb6c44bac0bed2854e76f90643097d', // 1inch Router
  '0x881d40237659c251811cec9c364ef91dc08d300c', // Metamask Swap Router
  '0xe66b31678d6c16e9ebf358268a790b763c133750', // Coinbase Wallet Swapper
  '0x00000000009726632680fb29d3f7a9734e3010e2', // Rainbow Router
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff', // 0x Exchange Proxy. NOTE - This is both an erc20 swap and erc721 swap contract. This address is in both contract lists.
];

export const ERC721_SALE_CONTRACTS = [
  '0x00000000006c3852cbef3e08e8df289169ede581', // Seaport v1.1
  '0x00000000000006c7676171937c444f6bde3d6282', // Seaport v1.2
  '0x0000000000000ad24e80fd803c6ac37206a45f15', // Seaport v1.3
  '0x00000000000001ad428e4906ae43d8f9852d0dd6', // Seaport v1.4
  '0x00000000000000adc04c56bf30ac9d3c0aaf14dc', // Seaport v1.5
  '0x7be8076f4ea4a4ad08075c2508e481d6c946d12b', // Wyvern v1
  '0x7f268357a8c2552623316e2562d90e642bb538e5', // Wyvern v2
  '0x59728544b08ab483533076417fbbb2fd0b17ce3a', // LooksRare Exchange
  '0x39da41747a83aee658334415666f3ef92dd0d541', // Blur 1
  '0x000000000000ad05ccc4f10045630fb830b95127', // Blur 2
  '0x1073777134ccc108b9f59bdceb101588d64b6bdb', // Cameron on Farcaster's Marketplace
  '0xb4e7b8946fa2b35912cc0581772cccd69a33000c', // Element Swap 2
  '0x83c8f28c26bf6aaca652df1dbbe0e1b56f8baba2', // Gem
  '0x0a267cf51ef038fc00e71801f5a524aec06e4f07', // Genie
  '0xcdface5643b90ca4b3160dd2b5de80c1bf1cb088', // Genie: Seaport Aggregator
  '0x74312363e45dcaba76c59ec49a7aa8a65a67eed3', // X2Y2 Exchange
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff', // 0x Exchange Proxy. NOTE - This is both an erc20 swap and erc721 swap contract. This address is in both contract lists.
  '0x552b16d19dbad7af2786fe5a40d96d2a5c09428c', // AlphaSharks??
  '0x9e97195f937c9372fe5fda5e3b86e9b88cbefed7', // Gitcoin Grants Simple??
  '0x35ca26a7a7f3ca98f3e60bd94c139c892e45b6c3', // Gitcoin Grants Simple??
  '0x20f780a973856b93f63670377900c1d2a50a77c4', // Element Marketplace
  '0x36c72892fcc72b52fa3b82ed3bb2a467d9079b9a', // Unknown
  '0xe525fae3fc6fbb23af05e54ff413613a6573cff2', // Unknown discovered via Dreadfulz investigation (0x81ae0be3a8044772d04f32398bac1e1b4b215aa8)
  '0xac335e6855df862410f96f345f93af4f96351a87', // Unknown discovered via Dreadfulz investigation (0x81ae0be3a8044772d04f32398bac1e1b4b215aa8)
];

export const SAFE_METHOD_SIGNATURES = [
  // GnosisSafe
  // 'NAME()',
  'VERSION()',
  'nonce()',
  'domainSeparator()',
  'signedMessages(bytes32)',
  // 'setup(address[],uint256,address,bytes,address,address,uint256,address)',
  'execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)',
  'requiredTxGas(address,uint256,bytes,uint8)',
  'approveHash(bytes32)',
  // 'signMessage(bytes)',
  'isValidSignature(bytes,bytes)',
  // 'getMessageHash(bytes)',
  'encodeTransactionData(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,uint256)',
  'getTransactionHash(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,uint256)',
  // MasterCopy
  // 'changeMasterCopy(address)',
  // ModuleManager
  'enableModule(address)',
  'disableModule(address,address)',
  'execTransactionFromModule(address,uint256,bytes,uint8)',
  // 'execTransactionFromModuleReturnData(address,uint256,bytes,uint8)',
  // 'getModules()',
  // 'getModulesPaginated(address,uint256)',
  // OwnerManager
  'addOwnerWithThreshold(address,uint256)',
  'removeOwner(address,address,uint256)',
  'swapOwner(address,address,address)',
  'changeThreshold(uint256)',
  'getThreshold()',
  'isOwner(address)',
  'getOwners()',
  // FallbackManager
  // 'setFallbackHandler(address)',
];
export const EXECUTE_TRANSACTION_SIGNATURE =
  'execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)';

export const OLD_NFT_ADDRESSES = [
  '0x06012c8cf97bead5deae237070f9587f8e7a266d', // CryptoKitties
  '0xe897e5953ef250bd49875fe7a48254def92730b9', // FanBits
  '0x73b0ebea28f76be1368d578d13657354330472a9', // XART
  '0xdcaad9fd9a74144d226dbf94ce6162ca9f09ed7e', // CryptoStrikers
  '0xf5b0a3efb8e8e4c201e2a935f110eaaf3ffecb8d', // Axie Infinity
  '0xf7a6e15dfd5cdd9ef12711bd757a9b6021abf643', // CryptoBots (NOTE - this one might be weird because the transfer event has _no_ indexed fields)
  '0xdde2d979e8d39bb8416eafcfc1758f3cab2c9c72', // Known Origin
  '0x79986af15539de2db9a5086382daeda917a9cf0c', // CryptoVoxels
  '0x323a3e1693e7a0959f65972f3bf2dfcb93239dfe', // Digital Art Chain
  '0x552d72f86f04098a4eaeda6d7b665ac12f846ad2', // Dark Winds
];

export const CRYPTO_PUNKS_ADDRESSES = [
  '0x6ba6f2207e343923ba692e5cae646fb0f566db8d', // CRYPTOPUNKS_OLD
  '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb', // CRYPTOPUNKS_NEW
];

export const ERC721_TRANSFER_EVENT = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const;

export const ERC20_TRANSFER_EVENT = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const;

export const ERC1155_TRANSFER_EVENT = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'TransferSingle',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'ids',
        type: 'uint256[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'values',
        type: 'uint256[]',
      },
    ],
    name: 'TransferBatch',
    type: 'event',
  },
] as const;

export const WETH_EVENTS = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' },
    ],
    name: 'Deposit',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' },
    ],
    name: 'Withdrawal',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'src', type: 'address' },
      { indexed: true, name: 'dst', type: 'address' },
      { indexed: false, name: 'wad', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const;

export const ERC721_TRANSFER_EVENT_1 = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const;

export const ERC721_TRANSFER_EVENT_2 = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
] as const;

export const CRYPTO_PUNKS_TRANSFER_EVENTS = [
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'punkIndex', type: 'uint256' },
    ],
    name: 'PunkTransfer',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'punkIndex', type: 'uint256' },
      { indexed: false, name: 'value', type: 'uint256' },
      { indexed: true, name: 'fromAddress', type: 'address' },
      { indexed: true, name: 'toAddress', type: 'address' },
    ],
    name: 'PunkBought',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'punkIndex', type: 'uint256' },
    ],
    name: 'Assign',
    type: 'event',
  },
] as const;

export const PROXY_IMPLEMENTATION_METHOD_SIGNATURES = [
  'implementation()',
  'IMPL()',
];
