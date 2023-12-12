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
      const templateDir = path.join(srcDir, 'template');
      const protocolDir = path.join(srcDir, 'protocol', name);

      const TEMPLATE_PATHS = {
        index: {
          template: 'index.template.hbs',
          src: 'index.ts',
        },
        template: {
          template: 'contextualizer.template.hbs',
          src: `${name}.ts`,
        },
        spec: {
          template: 'contextualizer.spec.template.hbs',
          src: `${name}.spec.ts`,
        },
        constants: {
          template: 'constants.template.hbs',
          src: `constants.ts`,
        },
        abis: {
          template: 'abi/abi.template.hbs',
          src: `abis/${camelToCapitalCase(name)}.json`,
        },
      };
      // Data to replace variables
      const data = {
        camelCaseName: name,
        pascalCaseName: camelToPascalCase(name),
        capitalCaseName: camelToCapitalCase(name),
      };

      try {
        console.log(`Creating a new contextualizer: ${name}`);

        // fetch transaction if hash is provided
        if (options.hash) {
          const txHashShorten = shortenTxHash(options.hash);
          // grab transaction from api and save it in test/transactions
          await grabTx(options.hash, name);
          // add test transaction file name to template data
          data['txHashShorten'] = txHashShorten;
        } else {
          // TODO; set default shorten hash
          data['txHashShorten'] = '[INSERT_TX_HASH_HERE]';
        }

        // create directory
        for (const key in TEMPLATE_PATHS) {
          ensureDirectoryExistence(
            path.join(protocolDir, TEMPLATE_PATHS[key].src),
          );
        }
        // copy template
        for (const key in TEMPLATE_PATHS) {
          const templateSource = fs.readFileSync(
            path.join(templateDir, TEMPLATE_PATHS[key].template),
            'utf8',
          );
          const template = Handlebars.compile(templateSource);
          // Replace with actual contextualizer name
          const srcContent = template(data);
          // write file
          fs.writeFileSync(
            path.join(protocolDir, TEMPLATE_PATHS[key].src),
            srcContent,
          );
        }

        console.log(
          `Successfully created a new contextualizer: ${protocolDir}`,
        );

        process.exit(0); // Successful exit
      } catch (error) {
        console.error('Error during file operation:', error);
        process.exit(1); // Exit with error
      }
    });
}

function camelToPascalCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function camelToCapitalCase(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}

// Function to ensure that a directory exists
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname);
}
