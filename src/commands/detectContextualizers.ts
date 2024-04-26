import { program } from './main';
import { getTransaction } from './utils';
import { Transaction } from '../types';
import { contextualizer } from '../contextualizers';

export function registerDetectContextualizersCommand() {
  program
    .command('detect-contextualizers')
    .description('Run contextualizers for a certain transaction')
    .option('-h, --hash <hash>', 'Transaction hash')
    .action(async (options) => {
      let transaction: Transaction;
      try {
        console.log(`Fetching a transaction`);
        transaction = await getTransaction(options.hash);

        const txResult = contextualizer.contextualize(transaction);
        if (!txResult.from) {
          console.error(
            `No matching protocol contextualizer on ${transaction.hash}`,
          );
        }

        console.log('Successfully ran contextualizers');
        process.exit(0); // Successful exit
      } catch (error) {
        console.error('Running contextualizers failed:', error);
        process.exit(1); // Exit with error
      }
    });
}
