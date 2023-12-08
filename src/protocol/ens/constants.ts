export const ENS_CONTRACTS = {
  registrar: {
    '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5': {
      id: 'RegistrarV2',
      abi: [
        'function commit(bytes32 commitment)',
        'function register(string name, address owner, uint256 duration, bytes32 secret)',
        'function registerWithConfig(string name, address owner, uint256 duration, bytes32 secret, address resolver, address addr)',
        'function renew(string name, uint256 duration)',
      ],
    },
    '0x253553366da8546fc250f225fe3d25d0c782303b': {
      id: 'RegistrarV3',
      abi: [
        'function commit(bytes32 commitment)',
        'function register(string name, address owner, uint256 duration, bytes32 secret, address resolver, bytes[] data, bool reverseRecord, uint16 ownerControlledFuses)',
        'function renew(string name, uint256 duration)',
      ],
    },
  },
  reverse: {
    '0x084b1c3c81545d370f3634392de611caabff8148': {
      id: 'Reverse',
      abi: ['function setName(string name)'],
    },
  },
  '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72': {
    id: 'Token',
    abi: [],
  },
};
