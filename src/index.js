import { program } from 'commander';
import fs from 'fs';
import path from 'path';
import proc from 'process';
import compareStrings from './main.js';

const readFile = (filepath) => {
  const currentDir = proc.cwd();
  const fullpath = filepath.startsWith('/') ? filepath : path.resolve(currentDir, filepath);

  const content = fs.readFileSync(fullpath, 'utf-8');

  return content;
};

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .argument('<pathA>')
  .argument('<pathB>')
  .option('-f, --format <type>', 'output format')
  .action((pathA, pathB) => {
    const contentA = readFile(pathA);
    const contentB = readFile(pathB);
    const result = compareStrings(contentA, contentB);
    console.log(result);
    return result;
  });

export default program;
