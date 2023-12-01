import * as fs from 'fs';
import * as path from 'path';
import { shortenTxHash } from '../helpers/utils';

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
