import { program } from 'commander';
import { compareStrings } from './main.js'

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .option('-f, --format <type>', 'output format');

program.parse();

export default program;
