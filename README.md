# EVM Context

![Screenshot 2023-12-01 at 1 26 47 PM](https://github.com/waterfall-mkt/curta-write-ups/assets/26611339/d8e17298-c339-43f8-a0e8-52e91caaa5e8)

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

```
npm run create:contextualizer [name of protocol] -- -h [transaction hash]`
```

This will generate a new file called `protocol/[name of protocol].ts` and a test file called `protocol/[name of protocol].spec.ts`.

### Tests

#### Running tests

```
npm run test
```

### Running contextualizers

```
npm run run:contextualizers -- -l [number of transactions]
```

This will run contextualizers for the latest transactions.

#### Writing tests

You should write unit tests for your PR using a real transaction. Do this by running:

```
npm run grab:transaction [txHash] [nickname for the type of tx]
```

### Finishing your new contextualization

Once that's ready, please open a PR on this repo and request review from [pcowgill](https://github.com/pcowgill) and [jordanmessina](https://github.com/jordanmessina)

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
