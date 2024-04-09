// Across Protocol event hashes and sigs
export const FUNDS_DEPOSITED_EVENT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'originChainId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'destinationChainId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int64',
        name: 'relayerFeePct',
        type: 'int64',
      },
      {
        indexed: true,
        internalType: 'uint32',
        name: 'depositId',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'uint32',
        name: 'quoteTimestamp',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'originToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'depositor',
        type: 'address',
      },
      { indexed: false, internalType: 'bytes', name: 'message', type: 'bytes' },
    ],
    name: 'FundsDeposited',
    type: 'event',
  },
];
export const FILLED_RELAY_EVENT_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'totalFilledAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'fillAmount',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'repaymentChainId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'originChainId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'destinationChainId',
        type: 'uint256',
      },
      {
        indexed: false,
        internalType: 'int64',
        name: 'relayerFeePct',
        type: 'int64',
      },
      {
        indexed: false,
        internalType: 'int64',
        name: 'realizedLpFeePct',
        type: 'int64',
      },
      {
        indexed: true,
        internalType: 'uint32',
        name: 'depositId',
        type: 'uint32',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'destinationToken',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'relayer',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'depositor',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      { indexed: false, internalType: 'bytes', name: 'message', type: 'bytes' },
      {
        components: [
          { internalType: 'address', name: 'recipient', type: 'address' },
          { internalType: 'bytes', name: 'message', type: 'bytes' },
          { internalType: 'int64', name: 'relayerFeePct', type: 'int64' },
          { internalType: 'bool', name: 'isSlowRelay', type: 'bool' },
          {
            internalType: 'int256',
            name: 'payoutAdjustmentPct',
            type: 'int256',
          },
        ],
        indexed: false,
        internalType: 'struct SpokePool.RelayExecutionInfo',
        name: 'updatableRelayData',
        type: 'tuple',
      },
    ],
    name: 'FilledRelay',
    type: 'event',
  },
];
export const ACROSS_PROTOCOL_RELAYERS = {
  1: '0x5c7bcd6e7de5423a257d81b442095a1a6ced35c5', // ethereum
  8453: '0x09aea4b2242abc8bb4bb78d537a67a245a7bec64', // base
  10: '0x6f26bf09b1c792e3228e5467807a900a503c0281', // optimism
  42161: '0xe35e9842fceaca96570b734083f4a58e8f7c5f2a', // arbitrum
};
