# EVM Context

<img width="960" alt="Screenshot 2024-02-23 at 4 39 50 PM" src="https://github.com/Once-Upon/context/assets/2731712/c2ac3b95-6be8-4d57-b200-0692311015d3">

## Context for Ethereum L1 and L2 transactions

If you want your protocol to work well on your own app, use a private indexer.<br/>
If you want your protocol to work well _across all of web3_, contribute to **EVM Context**.

#### Ideal contributors:

- Protocol teams

#### Ideal users

- Wallets
- Web3 browsing tools
- Web3 analytics tools

## Quick start

### Generating a new contextualization

If you're ready to start building with a certain transaction in mind:

```
npm run create:contextualizer [name of protocol] -- -h [transaction hash]
```

If you don't yet know which transaction you want to test against:

```
npm run create:contextualizer [name of protocol]
```

This will generate a new file called `protocol/[name of protocol].ts` and a test file called `protocol/[name of protocol].spec.ts`.

### Tests

```
npm run test
```

You should write unit tests for your PR using a real transaction.

If you used a tx hash when running `npm run create:contextualizer`, this is already set up for you.

To include more transactions in your tests, run this command:

```
npm run grab:transaction [txHash] [nickname for the type of tx]
```

### Running contextualizers

To confirm that the contextualizers work with live transaction data, run this command:

```
npm run run:contextualizers -- -l [number of transactions]
```

### Finishing your new contextualization

Once that's ready, please open a PR on this repo and request review from [pcowgill](https://github.com/pcowgill) and [jordanmessina](https://github.com/jordanmessina)

## Example contextualization

```typescript
// The transaction variable is an object containing the raw tx data

// the contextualization lives under the context key
transaction.context = {
  variables: {
    sender: {
      type: 'address',
      value: '0xabc...123',
    },
    asset1: {
      type: 'erc20',
      token: '0xdef...456', // the contract address
      value: '200',
    },
  },
  summaries: {
    category: 'PROTOCOL_1', // can be 1-5, with 1 being the "most important"
    // English
    en: {
      title: '<Name of protocol>', // e.g. Farcaster
      variables: {
        contextAction: {
          type: 'contextAction',
          value: 'sent',
        },
        // any other variables that only make sense for the english contextualization
        // ...
      },
      // default is the main sentence version, with others optionally defined below
      // this could be rendered however a UI wants
      // the most basic version would be "0xabc...123 sent 200 0xdef...456"
      default:
        '[[sender]] [[contextAction]] [[asset1]]',
    },
    // other languages
    // ...
  },
```

## Usage with an RPC endpoint directly

This library is meant to be usable with any RPC endpoint. It depends on some upstream convenience keys/values added to transaction objects - `assetTransfers` and `netAssetTransfers`, and `parties`.

#### Input

Raw transaction data from an EVM RPC

#### Output

Transaction objects with

- a `parties` key containing an array of involved parties (addresses included in input data, logs, etc.) in the transaction.
- an `assetTransfers` key containing an array of objects for all individual ETH, ERC20, ERC721, ERC1155 transfers that took place in that transaction.
- a `netAssetTransfers` key containing an object with rolled up net balance change information for each address involved in the transaction, containing their net gain or loss of ETH, ERC20, ERC721, ERC1155 in that that transaction.

In other words, `assetTransfers` shows everything that happened under the hood in order, and `netAssetTransfers` is a summary of the end result.

#### Example

```typescript
const inputTransaction = {
  to: '0xabc...123',
  // ...
};

const outputTransaction = {
  to: '0xabc...123',
  // ...
  parties: [
    '0x662127bf82b794a26b7ddb6b495f6a5a20b81738',
    '0x2d660d49473dbbcaf63929d10d0e3501b4533182',
    '0x8ca5e648c5dfefcdda06d627f4b490b719ccfd98',
    // ...
  ],
  assetTransfers: [
    {
      contract: '0x2d660d49473dbbcaf63929d10d0e3501b4533182',
      from: '0x0000000000000000000000000000000000000000',
      to: '0x662127bf82b794a26b7ddb6b495f6a5a20b81738',
      tokenId: '610',
      type: 'erc721',
    },
    // ..
  ],
  netAssetTransfers: {
    '0x662127bf82b794a26b7ddb6b495f6a5a20b81738': {
      received: [
        {
          contract: '0x2d660d49473dbbcaf63929d10d0e3501b4533182',
          tokenId: '610',
          type: 'erc721',
        },
      ],
      sent: [
        {
          asset: 'eth',
          id: 'eth',
          type: 'eth',
          value: '100777000000000000',
        },
      ],
    },
    // ..
  },
};
```

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
