const { Command } = require('commander');
import { registerCreateContextualizerCommand } from './createContextualizer';
import { registerGrabTransactionCommand } from './grabTransaction';
export const program = new Command();

program
  .name('Onceupon command')
  .description('CLI to some contextualizer utils')
  .version('0.1.0');

registerCreateContextualizerCommand();
registerGrabTransactionCommand();

program.parse(process.argv);
