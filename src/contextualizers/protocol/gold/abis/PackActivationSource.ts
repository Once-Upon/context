const abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'blockHash',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'blockNumber',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'activationSourceNonce',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'sizeSpecificTokenId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'width',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'height',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'tokenURI',
        type: 'string',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'activator',
        type: 'address',
      },
    ],
    name: 'ActivatedStarterPackOnSource',
    type: 'event',
  },
] as const;

export default abi;
