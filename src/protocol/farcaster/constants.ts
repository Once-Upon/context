import IdGatewayAbi from './abis/IdGateway';
import IdRegistryAbi from './abis/IdRegistry';
import KeyGatewayAbi from './abis/KeyGateway';
import KeyRegistryAbi from './abis/KeyRegistry';
import StorageRegistryAbi from './abis/StorageRegistry';
import BundlerAbi from './abis/Bundler';
import BundlerOldAbi from './abis/BundlerOld';

// TODO: Add these:
// SignedKeyRequestValidator | 0x00000000fc700472606ed4fa22623acf62c60553
// RecoveryProxy | 0x00000000fcb080a4d6c39a9354da9eb9bc104cd7
export const FarcasterContracts = {
  IdGateway: {
    address: '0x00000000fc25870c6ed6b6c7e41fb078b7656f69',
    abi: IdGatewayAbi,
  },
  IdRegistry: {
    address: '0x00000000fc6c5f01fc30151999387bb99a9f489b',
    abi: IdRegistryAbi,
  },
  KeyGateway: {
    address: '0x00000000fc56947c7e7183f8ca4b62398caadf0b',
    abi: KeyGatewayAbi,
  },
  KeyRegistry: {
    address: '0x00000000fc1237824fb747abde0ff18990e59b7e',
    abi: KeyRegistryAbi,
  },
  StorageRegistry: {
    address: '0x00000000fcce7f938e7ae6d3c335bd6a1a7c593d',
    abi: StorageRegistryAbi,
  },
  Bundler: {
    address: '0x00000000fc04c910a0b5fea33b03e0447ad0b0aa',
    abi: BundlerAbi,
  },
  BundlerOld: {
    address: '0x00000000fc94856f3967b047325f88d47bc225d0',
    abi: BundlerOldAbi,
  },
};
