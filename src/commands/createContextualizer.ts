import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import { program } from './main';
import { shortenTxHash } from '../helpers/utils';
import { grabTx } from './utils';

export function registerCreateContextualizerCommand() {
  program
    .command('create-contextualizer')
    .description('Create a new contextualizer')
    .argument('<name>', 'name of contextualizer')
    .option('-h, --hash <hash>', 'transaction hash')
    .action(async (name, options) => {
      const srcDir = path.join(__dirname, '..', '..', 'src');
      const contextualizerTemplateFilePath = path.join(
        srcDir,
        'template',
        'contextualizer.template.hbs',
      );
      const contextualizerSpecTemplateFilePath = path.join(
        srcDir,
        'template',
        'contextualizer.spec.template.hbs',
      );
      const newContextualizerFilePath = path.join(
        srcDir,
        'protocol',
        `${name}.ts`,
      );
      const newContextualizerSpecFilePath = path.join(
        srcDir,
        'protocol',
        `${name}.spec.ts`,
      );

      try {
        console.log(`Creating a new contextualizer: ${name}`);

        const contextualizerSource = fs.readFileSync(
          contextualizerTemplateFilePath,
          'utf8',
        );
        const contextualizerSpecSource = fs.readFileSync(
          contextualizerSpecTemplateFilePath,
          'utf8',
        );
        const contextualizerTemplate = Handlebars.compile(contextualizerSource);
        const contextualizerSpecTemplate = Handlebars.compile(
          contextualizerSpecSource,
        );
        // Data to replace variables
        const data = {
          lowercaseName: name,
          camelCaseName: capitalize(name),
        };
        // Replace with actual contextualizer name
        const contextualizerContent = contextualizerTemplate(data);
        // Write the modified contents to the new contextualizer file
        fs.writeFileSync(newContextualizerFilePath, contextualizerContent);
        // fetch transaction if hash is provided
        if (options.hash) {
          const txHashShorten = shortenTxHash(options.hash);
          // grab transaction from api and save it in test/transactions
          await grabTx(options.hash, name);
          // add test transaction file name to template data
          data['txHashShorten'] = txHashShorten;
        } else {
          // TODO; set default shorten hash
          data['txHashShorten'] = '<INSERT_TX_HASH_HERE>';
        }
        // write spec template
        const contextualizerSpecContent = contextualizerSpecTemplate(data);
        fs.writeFileSync(
          newContextualizerSpecFilePath,
          contextualizerSpecContent,
        );

        console.log(
          `Successfully created a new contextualizer: ${newContextualizerFilePath}`,
        );

        process.exit(0); // Successful exit
      } catch (error) {
        console.error('Error during file operation:', error);
        process.exit(1); // Exit with error
      }
    });
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
