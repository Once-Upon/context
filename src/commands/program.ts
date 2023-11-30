const { Command } = require('commander');
const program = new Command();

program
  .name('Onceupon command')
  .description('CLI to some contextualizer utils')
  .version('0.1.0');

export default program;
