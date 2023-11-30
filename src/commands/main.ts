const { Command } = require('commander');
import { registerCreateContextualizerCommand } from './createContextualizer';
export const program = new Command();

program
  .name('Onceupon command')
  .description('CLI to some contextualizer utils')
  .version('0.1.0');

registerCreateContextualizerCommand();

program.parse(process.argv);
