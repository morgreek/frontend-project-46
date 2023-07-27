import { test, expect, beforeEach } from '@jest/globals';
import { fileURLToPath } from 'url';
import { dirname, path } from 'path';
import program from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

let file1Path;
let file2Path;

beforeEach(() => {
  file1Path = getFixturePath('file1.json');
  file2Path = getFixturePath('file2.json');
});

test('common case', () => {
  const result = program.parse();
  const expection = '{\n'
                  + '  - follow: false\n'
                  + '    host: hexlet.io\n'
                  + '  - proxy: 123.234.53.22\n'
                  + '  - timeout: 50\n'
                  + '  + timeout: 20\n'
                  + '  + verbose: true\n'
                  + '}';
  expect(result).toEqual(expection);
});
