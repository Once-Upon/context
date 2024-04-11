export const HOP_TRANSFER_SENT_EVENT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'bytes32',
        name: 'transferId',
        type: 'bytes32',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'chainId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'bytes32',
        name: 'transferNonce',
        type: 'bytes32',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'bonderFee',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amountOutMin',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'deadline',
        type: 'uint256',
      },
    ],
    name: 'TransferSent',
    type: 'event',
  },
];
// Hop relayers
export const HOP_RELAYERS = {
  1: '0xb8901acb165ed027e32754e0ffe830802919727f',
  10: '0x83f6244bd87662118d96d9a6d44f09dfff14b30e',
  8453: '0x3666f603cc164936c1b87e207f36beba4ac5f18a',
  42161: '0x3749c4f034022c39ecaffaba182555d4508caccc',
};
