# EVM Context

> Context for Ethereum L1 and L2 transactions.

If you want your protocol to work well on your own app, you can stick with a private indexer for your protocol.

If you want your protocol to work well across all of web3, contribute to **EVM Context**.

##### Ideal contributors

- Protocol teams

##### Ideal users

- Wallets
- Web3 browsing tools
- Web3 analytics tools

## Quick start

### Generating a new contextualization

Run this command `npm run create:contextualizer [name of protocol] -- -h [transaction hash]`

This will generate a new file called `protocol/[name of protocol].ts` and a test file called `protocol/[name of protocol].spec.ts`.

### Writing tests

You should write unit tests for your PR using a real transaction.

You can do this by running `npm run grab:transaction [txHash] [nickname for the type of tx]`.

### Finishing your new contextualization

Once that's ready, please open a PR on this repo and request review from `pcowgill` and `jordanmessina`

## License

See the [LICENSE](LICENSE.md) file for license rights and limitations (MIT).
