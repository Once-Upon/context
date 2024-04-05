import { Abi } from 'viem';

export const TRANSACTION_DEPOSITED_EVENT_HASH =
  '0xb3813568d9991fc951961fcb4c784893574240a28925604d09fc577c55bb7c32';

export const TRANSACTION_DEPOSITED_EVENT_ABI: Abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'version',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'opaqueData',
        type: 'bytes',
      },
    ],
    name: 'TransactionDeposited',
    type: 'event',
  },
];

export const GATEWAY_CHAIN_ID_MAPPING = {
  '0x49048044d57e1c92a77f79988d21fa8faf74e97e': 8453,
  '0xbeb5fc579115071764c7423a4f12edde41f106ed': 10,
};
