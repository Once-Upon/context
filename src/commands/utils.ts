import * as fs from 'fs';
import * as path from 'path';
import { shortenTxHash } from '../helpers/utils';
import { Transaction } from '../types';
import {
  cancelPendingTransactionContextualizer,
  contractDeploymentContextualizer,
  erc20SwapContextualizer,
  erc721PurchaseContextualizer,
  erc721SaleContextualizer,
  erc1155PurchaseContextualizer,
  erc1155SaleContextualizer,
  ethTransferContextualizer,
  idmContextualizer,
  tokenAirdropContextualizer,
  tokenApprovalContextualizer,
  tokenMintContextualizer,
  tokenTransferContextualizer,
} from '../heuristics';
import {
  ensContextualizer,
  ensReverseContextualizer,
  superchainFaucetContextualizer,
  wethContextualizer,
} from '../protocol';

export const grabTx = async (txHash: string, prefix: string) => {
  const srcDir = path.join(__dirname, '..', '..', 'src');

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
    `${API_URL}/v1/transactions/${txHash}?withContext=false`,
  ).then((res) => res.json());

  // write to file
  fs.writeFileSync(txFilePath, JSON.stringify(transaction, null, 2));
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
  const defaultApiUrl = 'https://api.onceupon.gg';
  const API_URL = process.env.API_URL || defaultApiUrl;
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

export const heuristicContextualizers = {
  cancelPendingTransactionContextualizer:
    cancelPendingTransactionContextualizer,
  contractDeploymentContextualizer: contractDeploymentContextualizer,
  erc20SwapContextualizer: erc20SwapContextualizer,
  erc721PurchaseContextualizer: erc721PurchaseContextualizer,
  erc721SaleContextualizer: erc721SaleContextualizer,
  erc1155PurchaseContextualizer: erc1155PurchaseContextualizer,
  erc1155SaleContextualizer: erc1155SaleContextualizer,
  ethTransferContextualizer: ethTransferContextualizer,
  idmContextualizer: idmContextualizer,
  tokenAirdropContextualizer: tokenAirdropContextualizer,
  tokenApprovalContextualizer: tokenApprovalContextualizer,
  tokenMintContextualizer: tokenMintContextualizer,
  tokenTransferContextualizer: tokenTransferContextualizer,
};
export const protocolContextualizers = {
  ensContextualizer: ensContextualizer,
  ensReverseContextualizer: ensReverseContextualizer,
  superchainFaucetContextualizer: superchainFaucetContextualizer,
  wethContextualizer: wethContextualizer,
};
