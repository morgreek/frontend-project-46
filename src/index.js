import fs from 'fs';
import path from 'path';
import proc from 'process';
import parser from './parsers.js';
import stylish from './stylish.js';
import diff from './main.js';

const readFile = (filepath) => {
  const currentDir = proc.cwd();
  const fullpath = filepath.startsWith('/') ? filepath : path.resolve(currentDir, filepath);

  const content = fs.readFileSync(fullpath, 'utf-8');

  return content;
};

export default (pathA, pathB) => {
  const contentA = readFile(pathA);
  const extA = path.extname(pathA);

  const contentB = readFile(pathB);
  const extB = path.extname(pathB);

  const objA = parser(contentA, extA);
  const objB = parser(contentB, extB);

  const difference = diff(objA, objB);
  const style = stylish(difference, 0);

  return style;
};
