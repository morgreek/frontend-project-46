#!/usr/bin/env node

import { program, Option } from 'commander';
import compareStrings from '../src/index.js';

const formatOption = new Option('-f, --format [type]', 'output format')
  .default('stylish')
  .choices(['stylish', 'plain', 'json']);

program
  .description('Compares two configuration files and shows a difference.')
  .version('1.0.0')
  .argument('<pathA>')
  .argument('<pathB>')
  .addOption(formatOption)
  .action((pathA, pathB) => {
    const result = compareStrings(pathA, pathB, program.opts().format);
    return result;
  });

program.parse(process.argv);
