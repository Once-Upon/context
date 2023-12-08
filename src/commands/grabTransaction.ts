import * as path from 'path';
import { program } from './main';
import { shortenTxHash } from '../helpers/utils';
import { grabTx } from './utils';

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
        // grab transaction from api and save it in test/transactions
        await grabTx(hash, prefix);
        console.log(`Transaction saved to ${txFilePath}`);
        process.exit(0); // Successful exit
      } catch (error) {
        console.error('Failed to grab the transaction:', error);
        process.exit(1); // Exit with error
      }
    });
}
