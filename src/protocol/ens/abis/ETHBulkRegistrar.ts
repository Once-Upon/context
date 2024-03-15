const abi = [
  {
    inputs: [
      {
        internalType: 'contract IETHRegistrarController',
        name: '_registrarController',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      { internalType: 'bytes32[]', name: 'commitmentList', type: 'bytes32[]' },
    ],
    name: 'bulkCommit',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string[]', name: 'name', type: 'string[]' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'bytes32', name: 'secret', type: 'bytes32' },
    ],
    name: 'bulkMakeCommitment',
    outputs: [
      { internalType: 'bytes32[]', name: 'commitmentList', type: 'bytes32[]' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string[]', name: 'names', type: 'string[]' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'duration', type: 'uint256' },
      { internalType: 'bytes32', name: 'secret', type: 'bytes32' },
    ],
    name: 'bulkRegister',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string[]', name: 'names', type: 'string[]' },
      { internalType: 'uint256', name: 'duration', type: 'uint256' },
    ],
    name: 'bulkRenew',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string[]', name: 'names', type: 'string[]' },
      { internalType: 'uint256', name: 'duration', type: 'uint256' },
    ],
    name: 'bulkRentPrice',
    outputs: [{ internalType: 'uint256', name: 'total', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'bytes32', name: 'commit', type: 'bytes32' }],
    name: 'commitments',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'bytes32', name: 'secret', type: 'bytes32' },
      { internalType: 'address', name: 'resolver', type: 'address' },
      { internalType: 'address', name: 'addr', type: 'address' },
    ],
    name: 'makeCommitmentWithConfig',
    outputs: [{ internalType: 'bytes32', name: 'commitment', type: 'bytes32' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'address', name: 'owner', type: 'address' },
      { internalType: 'uint256', name: 'duration', type: 'uint256' },
      { internalType: 'bytes32', name: 'secret', type: 'bytes32' },
      { internalType: 'address', name: 'resolver', type: 'address' },
      { internalType: 'address', name: 'addr', type: 'address' },
    ],
    name: 'registerWithConfig',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'registrarController',
    outputs: [
      {
        internalType: 'contract IETHRegistrarController',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export default abi;
