import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import { program } from './main';
import { shortenTxHash } from '../helpers/utils';

export function registerCreateContextualizerCommand() {
  program
    .command('create-contextualizer')
    .description('Create a new contextualizer')
    .argument('<name>', 'name of contextualizer')
    .option('-h, --hash', 'transaction hash')
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
          const fileName = name + '-' + txHashShorten;
          const txFilePath = path.join(
            srcDir,
            'test',
            'transactions',
            `${fileName}.json`,
          );
          // grab a transaction
          const defaultApiUrl = 'https://api.onceupon.gg';
          const API_URL = process.env.API_URL || defaultApiUrl;
          const transaction = await fetch(
            `${API_URL}/v1/transactions/${options.hash}?withContext=false`,
          ).then((res) => res.json());
          // write to file
          fs.writeFileSync(txFilePath, JSON.stringify(transaction, null, 2));
          // add test transaction file name to template data
          data['txHashShorten'] = txHashShorten;
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
