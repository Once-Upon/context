const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'attacker',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'winner',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'loser',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'scoresWon',
        type: 'uint256',
      },
    ],
    name: 'Attack',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'nftId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'deadId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'loserName',
        type: 'string',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'killer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'winnerName',
        type: 'string',
      },
    ],
    name: 'PetKilled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'petId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'reward',
        type: 'uint256',
      },
    ],
    name: 'RedeemRewards',
    type: 'event',
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'fromId', type: 'uint256' },
      { internalType: 'uint256', name: 'toId', type: 'uint256' },
    ],
    name: 'attack',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_deadId', type: 'uint256' },
      { internalType: 'uint256', name: '_tokenId', type: 'uint256' },
    ],
    name: 'kill',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default abi;
