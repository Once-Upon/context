import { Command } from 'commander';
import { registerCreateContextualizerCommand } from './createContextualizer';
import { registerGrabTransactionCommand } from './grabTransaction';
import { registerRunContextualizersCommand } from './runContextualizers';
import { registerGrabBlockCommand } from './grabBlock';

export const program = new Command();

program
  .name('Onceupon command')
  .description('CLI to some contextualizer utils')
  .version('0.1.0');

registerCreateContextualizerCommand();
registerGrabTransactionCommand();
registerRunContextualizersCommand();
registerGrabBlockCommand();

program.parse(process.argv);
