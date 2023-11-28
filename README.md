# context

By default, EVM based transactions are inscrutable and are lacking details about the context and intent of the transaction. Once Upon proposes standardizing a context layer on top of the protocol level data to help network operators, developers, and end users better understand what is happening onchain.

The npm package can be found [here](https://www.npmjs.com/package/@once-upon/evm-context).

## Quick start

### Generating a new contextualization

Run this command `npm run create --name [name of protocol]`

This will generate a new file called `protocol/[name of protocol].ts` and a test file called `protocol/[name of protocol].spec.ts`.

### Writing tests

You should write unit tests for your PR using a real transaction.

You can do this by running `npm run grab:transaction --hash [txHash] --prefix [nickname for the type of tx]`.

### Finishing your new contextualization

Once that's ready, please open a PR on this repo and request review from `pcowgill` and `jordanmessina`

# Overview

## Definitions

### Template Variables

### Summary

#### Description

#### Title

#### Context Action

## Types of contextualizations

##### Protocol

##### Heuristic
