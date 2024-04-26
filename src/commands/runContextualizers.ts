import { program } from './main';
import { fetchTransactions } from './utils';
import { Transaction } from '../types';
import { contextualizer } from '../contextualizers';

export function registerRunContextualizersCommand() {
  program
    .command('run-contextualizers')
    .description('Run contextualizers for the latest transactions')
    .option('-l, --limit <limit>', 'number of transactions')
    .action(async (options) => {
      const limit = options?.limit ? parseInt(options?.limit) : 25;
      let transactions: Transaction[] = [];
      try {
        console.log(`Fetching transactions`);
        transactions = await fetchTransactions(limit);
      } catch (err) {
        console.error(`failed to fetch transactions: `, err);
      }

      try {
        console.log(`Running contextualizers`);
        transactions.forEach((transaction) => {
          // run contextualizers
          console.log(`Running protocol contextualizer`);
          try {
            const txResult = contextualizer.contextualize(transaction);
            if (!txResult.from) {
              console.error(
                `No matching protocol contextualizer on ${transaction.hash}`,
              );
            }
          } catch (err) {
            console.error(
              `failed to run protocol contextualizer on ${transaction.hash}: `,
              err,
            );
          }
        });

        console.log('Successfully ran contextualizers');
        process.exit(0); // Successful exit
      } catch (error) {
        console.error('Running contextualizers failed:', error);
        process.exit(1); // Exit with error
      }
    });
}
