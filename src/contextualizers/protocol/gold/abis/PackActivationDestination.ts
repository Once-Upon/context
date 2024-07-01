const abi = [
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'addressListing',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: 'activationSourceNonce',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'plotTypeNameEntered',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'cropName',
        type: 'string',
      },
      {
        internalType: 'uint8[]',
        name: 'randomListingGrowthRate',
        type: 'uint8[]',
      },
      {
        internalType: 'uint8[]',
        name: 'randomListingYield',
        type: 'uint8[]',
      },
      {
        internalType: 'uint8',
        name: 'season',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'size',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'tileArea',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'fertilizer',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'growthRateIndex',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'yieldIndex',
        type: 'uint8',
      },
    ],
    name: 'activateDestination',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address[]',
        name: 'addressListing',
        type: 'address[]',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'plotIds',
        type: 'uint256[]',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'activationSourceNonce',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'activationDestinationNonce',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'admin',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'sugarcaneId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'assetDestination',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'season',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'size',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'tileArea',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'fertilizer',
        type: 'uint8',
      },
    ],
    name: 'ActivatedStarterPackOnDestination',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'minter',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'season',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'plotTypeName',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'plotTypeId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'width',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'height',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'tileArea',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'baseGrowthSpeed',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint8',
        name: 'baseYield',
        type: 'uint8',
      },
    ],
    name: 'MintedPlotPackActivate',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'gameAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'GameMintedToken',
    type: 'event',
  },
] as const;

export default abi;
