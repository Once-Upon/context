import BaseRegistrarAbi from './abis/BaseRegistrar';
import ReverseRegistrarAbi from './abis/ReverseRegistrar';
import NameWrapperAbi from './abis/NameWrapper';
import PublicResolverAbi from './abis/PublicResolver';

export const BNS_ADDRESSES = {
  baseRegistrar: '0x4079d84889e0e1ac22beec60dc8e5e7b621bf55d',
  reverseRegistrar: '0x0363696b6d369859f5fb4994a5ade574cd91d220',
  nameWrapper: '0xbd9bab0a97b2cc6aa28b9c902d7c656b121d5f9f',
  publicResolver: '0xa92659104eb42309ae9482f1d1ae934b9ee51dc3',
} as const;

export const BNS_CONTRACTS = {
  registrar: {
    [BNS_ADDRESSES.baseRegistrar]: {
      id: 'BaseRegistrarController',
      abi: BaseRegistrarAbi,
    },
  },
  reverse: {
    [BNS_ADDRESSES.reverseRegistrar]: {
      id: 'ReverseRegistrar',
      abi: ReverseRegistrarAbi,
    },
  },
  wrapper: {
    [BNS_ADDRESSES.nameWrapper]: {
      id: 'NameWrapper',
      abi: NameWrapperAbi,
    },
  },
  resolver: {
    [BNS_ADDRESSES.publicResolver]: {
      id: 'PublicResolver',
      abi: PublicResolverAbi,
    },
  },
};
