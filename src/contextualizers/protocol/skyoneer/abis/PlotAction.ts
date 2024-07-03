const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'plotId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'stakedElement',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newStakedElement',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'harvestableAmount',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'actuallyProducedAmount',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint24',
        name: 'plotHarvests',
        type: 'uint24',
      },
    ],
    name: 'HarvestedPlot',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'plotId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'diedStakedElement',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newStakedElement',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'diedAmount',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint24',
        name: 'plotDeaths',
        type: 'uint24',
      },
    ],
    name: 'ClearedDiedHarvest',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'plotId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'clearedStakedElement',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'newStakedElement',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'clearedAmount',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint24',
        name: 'plotClears',
        type: 'uint24',
      },
    ],
    name: 'ClearedHarvest',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'player',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'plotId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'stakedElement',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint16',
        name: 'stakedAmount',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'timeStartStaked',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'timeReadyDelta',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'timeExpiredDelta',
        type: 'uint64',
      },
    ],
    name: 'StakedCrop',
    type: 'event',
  },
] as const;

export default abi;
