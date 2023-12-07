// TODO: Add these:
// SignedKeyRequestValidator | 0x00000000fc700472606ed4fa22623acf62c60553
// RecoveryProxy | 0x00000000fcb080a4d6c39a9354da9eb9bc104cd7
export const FarcasterContracts = {
  IdGateway: {
    address: '0x00000000fc25870c6ed6b6c7e41fb078b7656f69',
    abi: [
      'function register(address recovery) external payable returns (uint256, uint256)',
      'function register(address recovery, uint256 extraStorage) external payable returns (uint256, uint256)',
    ],
  },
  IdRegistry: {
    address: '0x00000000fc6c5f01fc30151999387bb99a9f489b',
    abi: [
      'function changeRecoveryAddressFor(address owner, address recovery, uint256 deadline, bytes calldata sig)',
      'function transfer(address to,uint256 deadline,bytes sig)',
      'event Register(address indexed to, uint256 indexed id, address recovery)',
    ],
  },
  KeyGateway: {
    address: '0x00000000fc56947c7e7183f8ca4b62398caadf0b',
    abi: [
      'function add(uint32 keyType, bytes key, uint8 metadataType, bytes metadata)',
      'function addFor(address fidOwner, uint32 keyType, bytes key, uint8 metadataType, bytes metadata, uint256 deadline, bytes sig)',
    ],
  },
  KeyRegistry: {
    address: '0x00000000fc1237824fb747abde0ff18990e59b7e',
    abi: [
      'function remove(bytes key)',
      'function removeFor(address fidOwner, bytes key, uint256 deadline, bytes calldata sig)',
    ],
  },
  StorageRegistry: {
    address: '0x00000000fcce7f938e7ae6d3c335bd6a1a7c593d',
    abi: ['function rent(uint256 fid, uint256 units)'],
  },
  Bundler: {
    address: '0x00000000fc04c910a0b5fea33b03e0447ad0b0aa',
    abi: [
      'function register(tuple(address to, address recovery, uint256 deadline, bytes sig) registerParams, tuple(uint32 keyType, bytes key, uint8 metadataType, bytes metadata, uint256 deadline, bytes sig)[] signerParams, uint256 extraStorage) external payable returns (uint256)',
    ],
  },
  BundlerOld: {
    address: '0x00000000fc94856f3967b047325f88d47bc225d0',
    abi: [
      'function register(tuple(address to, address recovery, uint256 deadline, bytes sig) registerParams, tuple(uint32 keyType, bytes key, uint8 metadataType, bytes metadata, uint256 deadline, bytes sig)[] signerParams, uint256 extraStorage) external payable returns (uint256)',
    ],
  }
};
