import { program } from './main';
import { fetchTransactions } from './utils';
import * as protocolContextualizers from '../protocol';
import * as heuristicContextualizers from '../heuristics';

export function registerRunContextualizersCommand() {
  program
    .command('run-contextualizers')
    .description('Run contextualizers for the latest transactions')
    .option('-l, --limit <limit>', 'number of transactions')
    .action(async (options) => {
      const limit = options?.limit ? parseInt(options?.limit) : 25;
      let transactions = [];
      try {
        console.log(`Fetching transactions`);
        transactions = await fetchTransactions(limit);
      } catch (err) {
        console.error(`failed to fetch transactions: `, err);
      }

      try {
        console.log(`Running contextualizers`);
        const contextualizersPromise =
          transactions &&
          transactions.map((transaction) => {
            // run heuristic contextualizers
            for (const contextualizerName in heuristicContextualizers) {
              const contextualizer =
                heuristicContextualizers[contextualizerName];
              try {
                const txResult = contextualizer(transaction);
                if (!txResult.from) {
                  console.error(
                    `failed to run ${contextualizerName} on ${transaction.hash}`,
                  );
                }
              } catch (err) {
                console.error(err);
              }
            }
            // run protocol contextualizers
            for (const contextualizerName in protocolContextualizers) {
              const contextualizer =
                protocolContextualizers[contextualizerName];
              try {
                contextualizer(transaction);
              } catch (err) {
                console.error(
                  `failed to run ${contextualizerName} on ${transaction.hash}: `,
                  err,
                );
              }
            }
          });

        await Promise.all(contextualizersPromise);
        console.log('Successfully ran contextualizers');
        process.exit(0); // Successful exit
      } catch (error) {
        console.error('Failed to grab the transaction:', error);
        process.exit(1); // Exit with error
      }
    });
}
