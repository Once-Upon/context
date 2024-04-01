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

This library is meant to be usable with any RPC endpoint. It depends on some upstream convenience keys/values added to transaction objects - `assetTransfers` and `netAssetTransfers`. To obtain those along with the raw data from an RPC endpoint, you can run the [@once-upon/evm-usability](https://github.com/Once-Upon/usability) library upstream of this library in your codebase.

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
