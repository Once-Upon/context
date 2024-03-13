import * as fs from 'fs/promises';
import * as path from 'path';
import { program } from './main';
import { grabTx } from './utils';

export function registerUpdateTestTransactionsCommand() {
  program
    .command('update-test-transactions')
    .description('Grab a transaction from API')
    .action(async (options) => {
      const testDataDir = path.join(
        __dirname,
        '..',
        '..',
        'src',
        'test',
        'transactions',
      );
      const testFiles = await fs.readdir(testDataDir);

      for (const testFile of testFiles) {
        const txFilePath = path.join(testDataDir, testFile);

        const fileString = await fs.readFile(txFilePath, 'utf-8');
        const fileObject = JSON.parse(fileString);

        const hash = fileObject.hash;
        const prefix = testFile.split('-').slice(0, -1).join('-');

        try {
          console.log(`Fetching transaction from transaction api: ${hash}`);
          // grab transaction from api and save it in test/transactions
          await grabTx(hash, prefix);
          console.log(`Transaction saved to ${txFilePath}`);
        } catch (error) {
          console.error('Failed to grab the transaction:', error);
          process.exit(1); // Exit with error
        }
      }

      process.exit(0); // Successful exit
    });
}
