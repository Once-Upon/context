export const ENSContracts = {
  RegistrarV2: {
    address: '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5',
    abi: [
      'commit(bytes32 commitment)',
      'register(string name, address owner, uint256 duration, bytes32 secret)',
      'registerWithConfig(string name, address owner, uint256 duration, bytes32 secret, address resolver, address addr)',
      'renew(string name, uint256 duration)',
    ],
  },
  RegistrarV3: {
    address: '0x253553366da8546fc250f225fe3d25d0c782303b',
    abi: [
      'commit(bytes32 commitment)',
      'register(string name, address owner, uint256 duration, bytes32 secret)',
      'registerWithConfig(string name, address owner, uint256 duration, bytes32 secret, address resolver, address addr)',
      'renew(string name, uint256 duration)',
    ],
  },
  ReverseRegistrar: {
    address: '0x084b1c3c81545d370f3634392de611caabff8148',
    abi: [],
  },
  Token: {
    address: '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72',
    abi: [],
  },
  Reverse: {
    address: '0x084b1c3c81545d370f3634392de611caabff8148',
    abi: ['setName(string name)'],
  },
};
