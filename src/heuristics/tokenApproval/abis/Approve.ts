const abi = [
  {
    constant: false,
    inputs: [
      {
        internalType: 'address',
        type: 'address',
      },
      {
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

export default abi;
