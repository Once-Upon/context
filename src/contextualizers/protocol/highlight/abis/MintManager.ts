const abi = [
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
] as const;

export default abi;
