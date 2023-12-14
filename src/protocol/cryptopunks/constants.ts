import cryptoPunksOldAbi from './abis/CryptopunksOld.json';
import cryptoPunksAbi from './abis/Cryptopunks.json';

export const CryptopunksContracts = {
  Old: '0x6ba6f2207e343923ba692e5cae646fb0f566db8d',
  New: '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb',
};

export const CRYPTOPUNK_ABIS = {
  '0x6ba6f2207e343923ba692e5cae646fb0f566db8d': cryptoPunksOldAbi,
  '0xb47e3cd837ddf8e4c57f05d70ab865de6e193bbb': cryptoPunksAbi,
};
