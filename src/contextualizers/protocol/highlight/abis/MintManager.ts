const abi = [
  {
    inputs: [],
    name: 'AllowlistInvalid',
    type: 'error',
  },
  {
    inputs: [],
    name: 'AlreadyRegisteredWithId',
    type: 'error',
  },
  {
    inputs: [],
    name: 'CurrencyTypeInvalid',
    type: 'error',
  },
  {
    inputs: [],
    name: 'EtherSendFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidClaim',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidExecutorChanged',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidMechanic',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidPaymentAmount',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidTotalClaimed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MechanicPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MintFeeTooLow',
    type: 'error',
  },
  {
    inputs: [],
    name: 'MintPaused',
    type: 'error',
  },
  {
    inputs: [],
    name: 'OnchainVectorMintGuardFailed',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SenderNotClaimer',
    type: 'error',
  },
  {
    inputs: [],
    name: 'SenderNotDirectEOA',
    type: 'error',
  },
  {
    inputs: [],
    name: 'Unauthorized',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UnsafeMintRecipient',
    type: 'error',
  },
  {
    inputs: [],
    name: 'VectorUpdateActionFrozen',
    type: 'error',
  },
  {
    inputs: [],
    name: 'VectorWrongCollectionType',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'vectorId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'onChainVector',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'tokenIds',
        type: 'uint256[]',
      },
    ],
    name: 'ChooseTokenMint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256[]',
        name: 'tokenIds',
        type: 'uint256[]',
      },
    ],
    name: 'CreatorReservesChooseMint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'isEditionBased',
        type: 'bool',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'editionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'numMinted',
        type: 'uint256',
      },
    ],
    name: 'CreatorReservesNumMint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'vectorId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'currency',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'rewardRecipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
    ],
    name: 'CreatorRewardPayout',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'currency',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'paymentRecipient',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'vectorId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'payer',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountToCreator',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'percentageBPSOfTotal',
        type: 'uint32',
      },
    ],
    name: 'ERC20Payment',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'vectorId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint48',
        name: 'editionId',
        type: 'uint48',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
    ],
    name: 'EditionVectorCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'version',
        type: 'uint8',
      },
    ],
    name: 'Initialized',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'mechanicVectorId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'paused',
        type: 'bool',
      },
    ],
    name: 'MechanicVectorPauseSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'mechanicVectorId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'mechanic',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'editionId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'isEditionBased',
        type: 'bool',
      },
    ],
    name: 'MechanicVectorRegistered',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'paymentRecipient',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'vectorId',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountToCreator',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'percentageBPSOfTotal',
        type: 'uint32',
      },
    ],
    name: 'NativeGasTokenPayment',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'vectorId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'onChainVector',
        type: 'bool',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'numMinted',
        type: 'uint256',
      },
    ],
    name: 'NumTokenMint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'executor',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'added',
        type: 'bool',
      },
    ],
    name: 'PlatformExecutorChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'newPlatformMintFee',
        type: 'uint256',
      },
    ],
    name: 'PlatformMintFeeUpdated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'vectorId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
    ],
    name: 'SeriesVectorCreated',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'vectorId',
        type: 'uint256',
      },
    ],
    name: 'VectorDeleted',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'vectorId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'bool',
        name: 'paused',
        type: 'bool',
      },
      {
        indexed: true,
        internalType: 'uint128',
        name: 'flexibleData',
        type: 'uint128',
      },
    ],
    name: 'VectorMetadataSet',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'vectorId',
        type: 'uint256',
      },
    ],
    name: 'VectorUpdated',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_executor',
        type: 'address',
      },
    ],
    name: 'addOrDeprecatePlatformExecutor',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'uint160',
            name: 'contractAddress',
            type: 'uint160',
          },
          {
            internalType: 'uint48',
            name: 'startTimestamp',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'endTimestamp',
            type: 'uint48',
          },
          {
            internalType: 'uint160',
            name: 'paymentRecipient',
            type: 'uint160',
          },
          {
            internalType: 'uint48',
            name: 'maxTotalClaimableViaVector',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'totalClaimedViaVector',
            type: 'uint48',
          },
          {
            internalType: 'uint160',
            name: 'currency',
            type: 'uint160',
          },
          {
            internalType: 'uint48',
            name: 'tokenLimitPerTx',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'maxUserClaimableViaVector',
            type: 'uint48',
          },
          {
            internalType: 'uint192',
            name: 'pricePerToken',
            type: 'uint192',
          },
          {
            internalType: 'uint48',
            name: 'editionId',
            type: 'uint48',
          },
          {
            internalType: 'bool',
            name: 'editionBasedCollection',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'requireDirectEOA',
            type: 'bool',
          },
          {
            internalType: 'bytes32',
            name: 'allowlistRoot',
            type: 'bytes32',
          },
        ],
        internalType: 'struct IAbridgedMintVector.AbridgedVectorData',
        name: '_vector',
        type: 'tuple',
      },
    ],
    name: 'createAbridgedVector',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'collection',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isEditionBased',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'editionId',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'numToMint',
        type: 'uint256',
      },
      {
        internalType: 'uint256[]',
        name: 'tokenIds',
        type: 'uint256[]',
      },
      {
        internalType: 'bool',
        name: 'isCollectorsChoice',
        type: 'bool',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
    ],
    name: 'creatorReservesMint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'contractAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'claimer',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'paymentRecipient',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'pricePerToken',
            type: 'uint256',
          },
          {
            internalType: 'uint64',
            name: 'numTokensToMint',
            type: 'uint64',
          },
          {
            internalType: 'uint256',
            name: 'maxClaimableViaVector',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxClaimablePerUser',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'editionId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'claimExpiryTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'claimNonce',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'offchainVectorId',
            type: 'bytes32',
          },
        ],
        internalType: 'struct MintManager.Claim',
        name: 'claim',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'claimSignature',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: 'mintRecipient',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isEditionBased',
        type: 'bool',
      },
    ],
    name: 'gatedNumMint',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'contractAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'claimer',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'paymentRecipient',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'pricePerToken',
            type: 'uint256',
          },
          {
            internalType: 'uint64',
            name: 'maxPerTxn',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'maxClaimableViaVector',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'maxClaimablePerUser',
            type: 'uint64',
          },
          {
            internalType: 'uint64',
            name: 'claimExpiryTimestamp',
            type: 'uint64',
          },
          {
            internalType: 'bytes32',
            name: 'claimNonce',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'offchainVectorId',
            type: 'bytes32',
          },
        ],
        internalType: 'struct MintManager.SeriesClaim',
        name: 'claim',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'claimSignature',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: 'mintRecipient',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'tokenIds',
        type: 'uint256[]',
      },
    ],
    name: 'gatedSeriesMintChooseToken',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'vectorId',
        type: 'uint256',
      },
    ],
    name: 'getAbridgedVector',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'contractAddress',
            type: 'address',
          },
          {
            internalType: 'uint48',
            name: 'startTimestamp',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'endTimestamp',
            type: 'uint48',
          },
          {
            internalType: 'address',
            name: 'paymentRecipient',
            type: 'address',
          },
          {
            internalType: 'uint48',
            name: 'maxTotalClaimableViaVector',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'totalClaimedViaVector',
            type: 'uint48',
          },
          {
            internalType: 'address',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'uint48',
            name: 'tokenLimitPerTx',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'maxUserClaimableViaVector',
            type: 'uint48',
          },
          {
            internalType: 'uint192',
            name: 'pricePerToken',
            type: 'uint192',
          },
          {
            internalType: 'uint48',
            name: 'editionId',
            type: 'uint48',
          },
          {
            internalType: 'bool',
            name: 'editionBasedCollection',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'requireDirectEOA',
            type: 'bool',
          },
          {
            internalType: 'bytes32',
            name: 'allowlistRoot',
            type: 'bytes32',
          },
        ],
        internalType: 'struct IAbridgedMintVector.AbridgedVector',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'vectorId',
        type: 'uint256',
      },
    ],
    name: 'getAbridgedVectorMetadata',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
      {
        internalType: 'uint128',
        name: '',
        type: 'uint128',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'vectorId',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'user',
        type: 'address',
      },
    ],
    name: 'getNumClaimedPerUserOffchainVector',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'platform',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'trustedForwarder',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'initialExecutor',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'initialPlatformMintFee',
        type: 'uint256',
      },
    ],
    name: 'initialize',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'vectorId',
        type: 'bytes32',
      },
      {
        internalType: 'bytes32',
        name: 'nonce',
        type: 'bytes32',
      },
    ],
    name: 'isNonceUsed',
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
        internalType: 'address',
        name: '_executor',
        type: 'address',
      },
    ],
    name: 'isPlatformExecutor',
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
        internalType: 'address',
        name: 'forwarder',
        type: 'address',
      },
    ],
    name: 'isTrustedForwarder',
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
        name: 'mechanicVectorId',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256[]',
        name: 'tokenIds',
        type: 'uint256[]',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'mechanicMintChoose',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'mechanicVectorId',
        type: 'bytes32',
      },
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint32',
        name: 'numToMint',
        type: 'uint32',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'mechanicMintNum',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'mechanicVectorMetadata',
    outputs: [
      {
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
      {
        internalType: 'uint96',
        name: 'editionId',
        type: 'uint96',
      },
      {
        internalType: 'address',
        name: 'mechanic',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'isEditionBased',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'isChoose',
        type: 'bool',
      },
      {
        internalType: 'bool',
        name: 'paused',
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
        name: '',
        type: 'bytes32',
      },
    ],
    name: 'offchainVectorsClaimState',
    outputs: [
      {
        internalType: 'uint256',
        name: 'numClaimed',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'proxiableUUID',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'contractAddress',
            type: 'address',
          },
          {
            internalType: 'uint96',
            name: 'editionId',
            type: 'uint96',
          },
          {
            internalType: 'address',
            name: 'mechanic',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'isEditionBased',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'isChoose',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'paused',
            type: 'bool',
          },
        ],
        internalType: 'struct IMechanicData.MechanicVectorMetadata',
        name: '_mechanicVectorMetadata',
        type: 'tuple',
      },
      {
        internalType: 'uint96',
        name: 'seed',
        type: 'uint96',
      },
      {
        internalType: 'bytes',
        name: 'vectorData',
        type: 'bytes',
      },
    ],
    name: 'registerMechanicVector',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'vectorId',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'pause',
        type: 'bool',
      },
      {
        internalType: 'uint128',
        name: 'flexibleData',
        type: 'uint128',
      },
    ],
    name: 'setAbridgedVectorMetadata',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes32',
        name: 'mechanicVectorId',
        type: 'bytes32',
      },
      {
        internalType: 'bool',
        name: 'pause',
        type: 'bool',
      },
    ],
    name: 'setPauseOnMechanicMintVector',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'vectorId',
        type: 'uint256',
      },
      {
        components: [
          {
            internalType: 'address',
            name: 'contractAddress',
            type: 'address',
          },
          {
            internalType: 'uint48',
            name: 'startTimestamp',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'endTimestamp',
            type: 'uint48',
          },
          {
            internalType: 'address',
            name: 'paymentRecipient',
            type: 'address',
          },
          {
            internalType: 'uint48',
            name: 'maxTotalClaimableViaVector',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'totalClaimedViaVector',
            type: 'uint48',
          },
          {
            internalType: 'address',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'uint48',
            name: 'tokenLimitPerTx',
            type: 'uint48',
          },
          {
            internalType: 'uint48',
            name: 'maxUserClaimableViaVector',
            type: 'uint48',
          },
          {
            internalType: 'uint192',
            name: 'pricePerToken',
            type: 'uint192',
          },
          {
            internalType: 'uint48',
            name: 'editionId',
            type: 'uint48',
          },
          {
            internalType: 'bool',
            name: 'editionBasedCollection',
            type: 'bool',
          },
          {
            internalType: 'bool',
            name: 'requireDirectEOA',
            type: 'bool',
          },
          {
            internalType: 'bytes32',
            name: 'allowlistRoot',
            type: 'bytes32',
          },
        ],
        internalType: 'struct IAbridgedMintVector.AbridgedVector',
        name: '_newVector',
        type: 'tuple',
      },
      {
        components: [
          {
            internalType: 'uint16',
            name: 'updateStartTimestamp',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'updateEndTimestamp',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'updatePaymentRecipient',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'updateMaxTotalClaimableViaVector',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'updateTokenLimitPerTx',
            type: 'uint16',
          },
          {
            internalType: 'uint16',
            name: 'updateMaxUserClaimableViaVector',
            type: 'uint16',
          },
          {
            internalType: 'uint8',
            name: 'updatePricePerToken',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'updateCurrency',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'updateRequireDirectEOA',
            type: 'uint8',
          },
          {
            internalType: 'uint8',
            name: 'updateMetadata',
            type: 'uint8',
          },
        ],
        internalType: 'struct IAbridgedMintVector.UpdateAbridgedVectorConfig',
        name: 'updateConfig',
        type: 'tuple',
      },
      {
        internalType: 'bool',
        name: 'pause',
        type: 'bool',
      },
      {
        internalType: 'uint128',
        name: 'flexibleData',
        type: 'uint128',
      },
    ],
    name: 'updateAbridgedVector',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'newPlatform',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'newOracle',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'gaslessMechanic',
        type: 'address',
      },
    ],
    name: 'updatePlatformAndMintFeeOracle',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
    ],
    name: 'upgradeTo',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newImplementation',
        type: 'address',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'upgradeToAndCall',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: 'userClaims',
    outputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'vectorId',
        type: 'uint256',
      },
      {
        internalType: 'uint48',
        name: 'numTokensToMint',
        type: 'uint48',
      },
      {
        internalType: 'address',
        name: 'mintRecipient',
        type: 'address',
      },
    ],
    name: 'vectorMint721',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'vectorMutabilities',
    outputs: [
      {
        internalType: 'uint8',
        name: 'updatesFrozen',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'deleteFrozen',
        type: 'uint8',
      },
      {
        internalType: 'uint8',
        name: 'pausesFrozen',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'vectorToEditionId',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    name: 'vectors',
    outputs: [
      {
        internalType: 'address',
        name: 'contractAddress',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'currency',
        type: 'address',
      },
      {
        internalType: 'address payable',
        name: 'paymentRecipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'startTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'endTimestamp',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'pricePerToken',
        type: 'uint256',
      },
      {
        internalType: 'uint64',
        name: 'tokenLimitPerTx',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'maxTotalClaimableViaVector',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'maxUserClaimableViaVector',
        type: 'uint64',
      },
      {
        internalType: 'uint64',
        name: 'totalClaimedViaVector',
        type: 'uint64',
      },
      {
        internalType: 'bytes32',
        name: 'allowlistRoot',
        type: 'bytes32',
      },
      {
        internalType: 'uint8',
        name: 'paused',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'currency',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'contractAddress',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'claimer',
            type: 'address',
          },
          {
            internalType: 'address payable',
            name: 'paymentRecipient',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'pricePerToken',
            type: 'uint256',
          },
          {
            internalType: 'uint64',
            name: 'numTokensToMint',
            type: 'uint64',
          },
          {
            internalType: 'uint256',
            name: 'maxClaimableViaVector',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxClaimablePerUser',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'editionId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'claimExpiryTimestamp',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'claimNonce',
            type: 'bytes32',
          },
          {
            internalType: 'bytes32',
            name: 'offchainVectorId',
            type: 'bytes32',
          },
        ],
        internalType: 'struct MintManager.Claim',
        name: 'claim',
        type: 'tuple',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
      {
        internalType: 'address',
        name: 'expectedMsgSender',
        type: 'address',
      },
    ],
    name: 'verifyClaim',
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
        internalType: 'uint256',
        name: 'amountToWithdraw',
        type: 'uint256',
      },
    ],
    name: 'withdrawNativeGasToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default abi;
