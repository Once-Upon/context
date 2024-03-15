import RegistrarV3Abi from './abis/RegistrarV3';
import RegistrarV2Abi from './abis/RegistrarV2';
import ETHBulkRegistrarAbi from './abis/ETHBulkRegistrar';
import BulkRegisterAbi from './abis/BulkRegister';
import ReverseAbi from './abis/Reverse';

export const ENS_ADDRESSES = {
  registrarV2: '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5',
  registrarV3: '0x253553366da8546fc250f225fe3d25d0c782303b',
  ethBulkRegistrar: '0x705bfbcfccde554e11df213bf6d463ea00dd57cc',
  bulkRegister: '0x1bfda2767beef9ef16ae31c67133a9510e34b90a',
  reverse: '0x084b1c3c81545d370f3634392de611caabff8148',
  token: '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72',
} as const;

export const ENS_CONTRACTS = {
  registrar: {
    [ENS_ADDRESSES.registrarV2]: {
      id: 'RegistrarV2',
      abi: RegistrarV2Abi,
    },
    [ENS_ADDRESSES.registrarV3]: {
      id: 'RegistrarV3',
      abi: RegistrarV3Abi,
    },
    [ENS_ADDRESSES.ethBulkRegistrar]: {
      id: 'ETHBulkRegistrar',
      abi: ETHBulkRegistrarAbi,
    },
    [ENS_ADDRESSES.bulkRegister]: {
      id: 'BulkRegister',
      abi: BulkRegisterAbi,
    },
  },
  reverse: {
    [ENS_ADDRESSES.reverse]: {
      id: 'Reverse',
      abi: ReverseAbi,
    },
  },
  [ENS_ADDRESSES.token]: {
    id: 'Token',
    abi: [],
  },
};
