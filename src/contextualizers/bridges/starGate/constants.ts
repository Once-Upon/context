export const STAR_GATE_BRIDGES = {
  1: '0x296f55f8fb28e498b858d0bcda06d955b2cb3f97', // ethereum
  10: '0x701a95707a0290ac8b90b3719e8ee5b210360883', // optimism
  8453: '0xaf54be5b6eec24d6bfacf1cce4eaf680a8239398', // base
  59144: '0x45f1a95a4d3f3836523f5c83673c797f4d4d263b', // linea
  137: '0x9d1b1669c73b033dfe47ae5a0164ab96df25b944', // polygon
  42161: '0xbf22f0f184bccbea268df387a49ff5238dd23e40', // arbitrum
};

export const STAR_GATE_POOLS = {
  1: '0x101816545f6bd2b1076434b54383a1e633390a2e', // ethereum
  10: '0xd22363e3762ca7339569f3d33eade20127d5f98c', // optimism
  8453: '0x28fc411f9e1c480ad312b3d9c60c22b965015c6b', // base
  59144: '0xaad094f6a75a14417d39f04e690fc216f080a41a', // linea
  137: '0x1205f31718499dbf1fca446663b532ef87481fe1', // polygon
  42161: '0x915a55e36a01285a14f05de6e81ed9ce89772f8e', // arbitrum
};

export const STAR_GATE_RELAYERS = {
  1: '0x4d73adb72bc3dd368966edd0f0b2148401a178e2', // ethereum
  10: '0x4d73adb72bc3dd368966edd0f0b2148401a178e2', // optimism
  8453: '0x38de71124f7a447a01d67945a51edce9ff491251', // base
  59144: '0x38de71124f7a447a01d67945a51edce9ff491251', // linea
  137: '0x4d73adb72bc3dd368966edd0f0b2148401a178e2', // polygon
  42161: '0x4d73adb72bc3dd368966edd0f0b2148401a178e2', // arbitrum
};

export const STAR_GATE_SEND_MSG_EVENT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint8',
        name: 'msgType',
        type: 'uint8',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'nonce',
        type: 'uint64',
      },
    ],
    name: 'SendMsg',
    type: 'event',
  },
];

export const STAR_GATE_PACKET_EVENT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'bytes',
        name: 'payload',
        type: 'bytes',
      },
    ],
    name: 'Packet',
    type: 'event',
  },
];

export const STAR_GATE_SWAP_EVENT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint16',
        name: 'chainId',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'dstPoolId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountSD',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'eqReward',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'eqFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'protocolFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'lpFee',
        type: 'uint256',
      },
    ],
    name: 'Swap',
    type: 'event',
  },
];

export const STAR_GATE_PACKET_RECEIVED_EVENT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint16',
        name: 'srcChainId',
        type: 'uint16',
      },
      {
        indexed: false,
        internalType: 'bytes',
        name: 'srcAddress',
        type: 'bytes',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'dstAddress',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint64',
        name: 'nonce',
        type: 'uint64',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'payloadHash',
        type: 'bytes32',
      },
    ],
    name: 'PacketReceived',
    type: 'event',
  },
];

export const STAR_GATE_CHAIN_IDS = {
  101: 1,
  109: 137,
  110: 42161,
  111: 10,
  183: 59144,
  184: 8453,
};
