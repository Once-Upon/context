import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import program from './program';

program
  .command('create-contextualizer')
  .description('Create a new contextualizer')
  .argument('<name>', 'name of contextualizer')
  .action((str, options) => {
    if (!options?.name) {
      console.error('Invalid command arguments');
      return;
    }

    const contextualizerDir = path.join(
      __dirname,
      '..',
      '..',
      'src',
      'contextualizer',
    );
    const contextualizerTemplateFilePath = path.join(
      contextualizerDir,
      'template',
      'contextualizer.template.hbs',
    );
    const contextualizerSpecTemplateFilePath = path.join(
      contextualizerDir,
      'template',
      'contextualizer.spec.template.hbs',
    );
    const newContextualizerFilePath = path.join(
      contextualizerDir,
      'protocol',
      `${options.name}.ts`,
    );
    const newContextualizerSpecFilePath = path.join(
      contextualizerDir,
      'protocol',
      `${options.name}.spec.ts`,
    );

    try {
      console.log(`Creating a new contextualizer: ${options.name}`);

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
        lowercaseName: options.name,
        camelCaseName: capitalize(options.name),
      };
      // Replace with actual contextualizer name
      const contextualizerContent = contextualizerTemplate(data);
      const contextualizerSpecContent = contextualizerSpecTemplate(data);
      // Write the modified contents to the new contextualizer file
      fs.writeFileSync(newContextualizerFilePath, contextualizerContent);
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

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

program.parse();
