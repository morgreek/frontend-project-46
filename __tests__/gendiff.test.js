import { fileURLToPath } from 'url';
import fs from 'fs';
import * as path from 'path';
import gendif from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const file1Path = getFixturePath('file1.json');
const file2Path = getFixturePath('file2.json');

const yFile1Path = getFixturePath('file1.yml');
const yFile2Path = getFixturePath('file2.yaml');

const fileResult = fs.readFileSync(getFixturePath('fileResult.txt'), 'utf-8');
const fileResultPlain = fs.readFileSync(getFixturePath('fileResultPlain.txt'), 'utf-8');
const fileResultJson = fs.readFileSync(getFixturePath('fileResultJson.txt'), 'utf-8');


test('common case', () => {
  // JSON
  expect(gendif(file1Path, file2Path, 'stylish')).toEqual(fileResult);
  expect(gendif(file1Path, file2Path, 'plain')).toEqual(fileResultPlain);
  expect(gendif(file1Path, file2Path, 'json')).toEqual(fileResultJson);

  // YAML
  expect(gendif(yFile1Path, yFile2Path, 'stylish')).toEqual(fileResult);
  expect(gendif(yFile1Path, yFile2Path, 'plain')).toEqual(fileResultPlain);
  expect(gendif(yFile1Path, yFile2Path, 'json')).toEqual(fileResultJson);
});
