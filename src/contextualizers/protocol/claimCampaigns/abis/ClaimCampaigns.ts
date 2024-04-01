const abi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: '_donationCollector',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes16',
        name: 'id',
        type: 'bytes16',
      },
    ],
    name: 'CampaignCancelled',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes16',
        name: 'id',
        type: 'bytes16',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'manager',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'end',
            type: 'uint256',
          },
          {
            internalType: 'enum ClaimCampaigns.TokenLockup',
            name: 'tokenLockup',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'root',
            type: 'bytes32',
          },
        ],
        indexed: false,
        internalType: 'struct ClaimCampaigns.Campaign',
        name: 'campaign',
        type: 'tuple',
      },
    ],
    name: 'CampaignStarted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes16',
        name: 'id',
        type: 'bytes16',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenLocker',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'start',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'cliff',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'period',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'periods',
            type: 'uint256',
          },
        ],
        indexed: false,
        internalType: 'struct ClaimCampaigns.ClaimLockup',
        name: 'claimLockup',
        type: 'tuple',
      },
    ],
    name: 'ClaimLockupCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes16',
        name: 'id',
        type: 'bytes16',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'claimer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountClaimed',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountRemaining',
        type: 'uint256',
      },
    ],
    name: 'TokensClaimed',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes16',
        name: 'id',
        type: 'bytes16',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'donationCollector',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'tokenLocker',
        type: 'address',
      },
    ],
    name: 'TokensDonated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '',
        type: 'bytes16',
      },
    ],
    name: 'campaigns',
    outputs: [
      {
        internalType: 'address',
        name: 'manager',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'token',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'end',
        type: 'uint256',
      },
      {
        internalType: 'enum ClaimCampaigns.TokenLockup',
        name: 'tokenLockup',
        type: 'uint8',
      },
      {
        internalType: 'bytes32',
        name: 'root',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: 'campaignId',
        type: 'bytes16',
      },
    ],
    name: 'cancelCampaign',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newCollector',
        type: 'address',
      },
    ],
    name: 'changeDonationcollector',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '',
        type: 'bytes16',
      },
    ],
    name: 'claimLockups',
    outputs: [
      {
        internalType: 'address',
        name: 'tokenLocker',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'start',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'cliff',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'period',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'periods',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: 'campaignId',
        type: 'bytes16',
      },
      {
        internalType: 'bytes32[]',
        name: 'proof',
        type: 'bytes32[]',
      },
      {
        internalType: 'uint256',
        name: 'claimAmount',
        type: 'uint256',
      },
    ],
    name: 'claimTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '',
        type: 'bytes16',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'claimed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: 'id',
        type: 'bytes16',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'manager',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'end',
            type: 'uint256',
          },
          {
            internalType: 'enum ClaimCampaigns.TokenLockup',
            name: 'tokenLockup',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'root',
            type: 'bytes32',
          },
        ],
        internalType: 'struct ClaimCampaigns.Campaign',
        name: 'campaign',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenLocker',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'start',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'cliff',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'period',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'periods',
            type: 'uint256',
          },
        ],
        internalType: 'struct ClaimCampaigns.ClaimLockup',
        name: 'claimLockup',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenLocker',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'start',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'cliff',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'period',
            type: 'uint256',
          },
        ],
        internalType: 'struct ClaimCampaigns.Donation',
        name: 'donation',
        type: 'tuple',
      },
    ],
    name: 'createLockedCampaign',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: 'id',
        type: 'bytes16',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'manager',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'token',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'end',
            type: 'uint256',
          },
          {
            internalType: 'enum ClaimCampaigns.TokenLockup',
            name: 'tokenLockup',
            type: 'uint8',
          },
          {
            internalType: 'bytes32',
            name: 'root',
            type: 'bytes32',
          },
        ],
        internalType: 'struct ClaimCampaigns.Campaign',
        name: 'campaign',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'tokenLocker',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'amount',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'rate',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'start',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'cliff',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'period',
            type: 'uint256',
          },
        ],
        internalType: 'struct ClaimCampaigns.Donation',
        name: 'donation',
        type: 'tuple',
      },
    ],
    name: 'createUnlockedCampaign',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes16',
        name: '',
        type: 'bytes16',
      },
    ],
    name: 'usedIds',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'root',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32[]',
        name: 'proof',
        type: 'bytes32[]',
      },
      {
        internalType: 'address',
        name: 'claimer',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'verify',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
] as const;

export default abi;
