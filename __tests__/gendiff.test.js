import { fileURLToPath } from 'url';
import fs from 'fs';
import * as path from 'path';
import gendif from '../src/main.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

let file1Path;
let file2Path;
let yFile1Path;
let yFile2Path;
let fileResult;

beforeEach(() => {
  file1Path = getFixturePath('file1.json');
  file2Path = getFixturePath('file2.json');

  yFile1Path = getFixturePath('file1.yml');
  yFile2Path = getFixturePath('file2.yaml');

  fileResult = fs.readFileSync(getFixturePath('fileResult.txt'), 'utf-8');
});

test('common case', () => {
  // JSON
  expect(gendif(file1Path, file2Path)).toEqual(fileResult);

  // YAML
  expect(gendif(yFile1Path, yFile2Path)).toEqual(fileResult)
});
