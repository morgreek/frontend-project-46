import { program } from 'commander';
import compareStrings from './main.js';

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .argument('<pathA>')
  .argument('<pathB>')
  .option('-f, --format <type>', 'output format')
  .action((pathA, pathB) => {
    const result = compareStrings(pathA, pathB);
    console.log(result);
    return result;
  });

export default program;
