import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';
import { shortenTxHash } from '../helpers/utils';
import { Transaction } from '../types';

export const grabTx = async (txHash: string, prefix: string) => {
  const srcDir = path.join(__dirname, '..', '..', 'src', 'contextualizers');

  const txHashShorten = shortenTxHash(txHash);
  const fileName = prefix + '-' + txHashShorten;
  const txFilePath = path.join(
    srcDir,
    'test',
    'transactions',
    `${fileName}.json`,
  );

  const defaultApiUrl = 'https://api.onceupon.gg';
  const API_URL = process.env.API_URL || defaultApiUrl;
  const transaction = await fetch(
    `${API_URL}/v2/transactions/${txHash}?withContext=false`,
  ).then((res) => res.json());

  // write to file
  fs.writeFileSync(txFilePath, JSON.stringify(transaction, null, 2));
};

export const getTransaction = async (txHash: string) => {
  const defaultApiUrl = 'https://api.onceupon.gg';
  const API_URL = process.env.API_URL || defaultApiUrl;
  const transaction = await fetch(
    `${API_URL}/v2/transactions/${txHash}?withContext=false`,
  ).then((res) => res.json());

  return transaction;
};

export const fetchTransactions = async (
  limit: number,
): Promise<Transaction[]> => {
  const defaultApiUrl = 'https://api.onceupon.gg';
  const API_URL = process.env.API_URL ?? defaultApiUrl;
  const requestBody = {
    contextAddress: {},
    filterAddresses: [],
    functionSelectors: [],
    tokenTransfers: [],
    dateRange: {},
    chainIds: [
      1, // ETHEREUM
      10, // OPTIMISM
      8453, // BASE
      7777777, // ZORA
      424, // PGN
    ],
    limit,
    skip: 0,
    sort: -1,
  };
  const transactions = await fetch(`${API_URL}/v1/transactions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  }).then((res) => res.json());

  return transactions;
};
