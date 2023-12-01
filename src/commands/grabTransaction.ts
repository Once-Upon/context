import * as fs from 'fs';
import * as path from 'path';
import { program } from './main';
import { shortenTxHash } from '../helpers/utils';

export function registerGrabTransactionCommand() {
  program
    .command('grab-transaction')
    .description('Grab a transaction from API')
    .argument('<hash>', 'transaction hash')
    .argument('<prefix>', 'file name prefix')
    .action(async (hash, prefix, options) => {
      const srcDir = path.join(__dirname, '..', '..', 'src');
      // generate a file name
      const fileName = prefix + '-' + shortenTxHash(hash);
      const txFilePath = path.join(
        srcDir,
        'test',
        'transactions',
        `${fileName}.json`,
      );

      try {
        console.log(`Fetching transaction from transaction api: ${hash}`);
        // grab a transaction
        const defaultApiUrl = 'https://api.onceupon.gg';
        const API_URL = process.env.API_URL || defaultApiUrl;
        const transaction = await fetch(
          `${API_URL}/v1/transactions/${hash}?withContext=false`,
        ).then((res) => res.json());

        // write to file
        fs.writeFileSync(txFilePath, JSON.stringify(transaction, null, 2));
        console.log(`Transaction saved to ${txFilePath}.json`);
        process.exit(0); // Successful exit
      } catch (error) {
        console.error('Failed to grab the transaction:', error);
        process.exit(1); // Exit with error
      }
    });
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
