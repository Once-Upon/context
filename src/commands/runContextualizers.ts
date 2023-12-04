import { program } from './main';
import {
  fetchTransactions,
  heuristicContextualizers,
  protocolContextualizers,
} from './utils';

export function registerRunContextualizersCommand() {
  program
    .command('run-contextualizers')
    .description('Run contextualizers for the latest 25 transactions')
    .action(async (options) => {
      try {
        console.log(`Fetching transactions`);
        const transactions = await fetchTransactions();
        console.log(`Running contextualizers`);
        const contextualizersPromise = transactions.map((transaction) => {
          // run heuristic contextualizers
          for (const contextualizerName in heuristicContextualizers) {
            const contextualizer = heuristicContextualizers[contextualizerName];
            try {
              const txResult = contextualizer(transaction);
              if (!txResult.from) {
                console.error(`failed to run ${contextualizerName}`);
              }
            } catch (err) {
              console.error(err);
            }
          }
          // run protocol contextualizers
          for (const contextualizerName in protocolContextualizers) {
            const contextualizer = protocolContextualizers[contextualizerName];
            try {
              const txResult = contextualizer(transaction);
              if (!txResult.from) {
                console.error(`failed to run ${contextualizerName}`);
              }
            } catch (err) {
              console.error(err);
            }
          }
        });

        await Promise.all(contextualizersPromise);
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
