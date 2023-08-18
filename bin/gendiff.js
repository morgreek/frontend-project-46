#!/usr/bin/env node

import { program } from 'commander';
import compareStrings from '../src/index.js';

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .argument('<pathA>')
  .argument('<pathB>')
  .option('-f, --format <type>', 'output format', 'stylish')
  .action((pathA, pathB) => {
    const result = compareStrings(pathA, pathB, program.opts().format);
    console.log(result);
    return result;
  });

program.parse(process.argv);
