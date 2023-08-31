import fs from 'fs';
import path from 'path';
import proc from 'process';
import parser from './parsers.js';
import formatter from './formatters/index.js';
import gendiff from './diff.js';

const readFile = (filepath) => {
  const currentDir = proc.cwd();
  const fullpath = filepath.startsWith('/') ? filepath : path.resolve(currentDir, filepath);

  const content = fs.readFileSync(fullpath, 'utf-8');

  return content;
};

export default (pathA, pathB, type = 'stylish') => {
  const contentA = readFile(pathA);
  const extA = path.extname(pathA).slice(1);

  const contentB = readFile(pathB);
  const extB = path.extname(pathB).slice(1);

  const objA = parser(contentA, extA);
  const objB = parser(contentB, extB);

  const difference = gendiff(objA, objB);

  const style = formatter(difference, type);

  return style;
};
