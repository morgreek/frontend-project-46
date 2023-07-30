import fs from 'fs';
import path from 'path';
import proc from 'process';
import _ from 'lodash';

const readFile = (filepath) => {
  const currentDir = proc.cwd();
  const fullpath = filepath.startsWith('/') ? filepath : path.resolve(currentDir, filepath);

  const content = fs.readFileSync(fullpath, 'utf-8');

  return content;
};

const compareObjects = (objA, objB) => {
  const result = ['{'];

  const keysA = _.keys(objA);
  const keysB = _.keys(objB);
  const allKeys = [...new Set([...keysA, ...keysB])].sort();
  const keysLength = allKeys.length;

  const tabs = '  ';
  const minus = `${tabs}- `;
  const plus = `${tabs}+ `;

  for (let i = 0; i < keysLength; i += 1) {
    const aHasKey = Object.hasOwn(objA, allKeys[i]);
    const bHasKey = Object.hasOwn(objB, allKeys[i]);

    if (aHasKey && bHasKey) {
      if (objA[allKeys[i]] === objB[allKeys[i]]) {
        result.push(`${tabs}${tabs}${allKeys[i]}: ${objA[allKeys[i]]}`);
      } else {
        result.push(`${minus}${allKeys[i]}: ${objA[allKeys[i]]}`);
        result.push(`${plus}${allKeys[i]}: ${objB[allKeys[i]]}`);
      }
    } else if (aHasKey) {
      result.push(`${minus}${allKeys[i]}: ${objA[allKeys[i]]}`);
    } else {
      result.push(`${plus}${allKeys[i]}: ${objB[allKeys[i]]}`);
    }
  }

  result.push('}');

  return result.join('\n');
};

export default (pathA, pathB) => {
  const contentA = readFile(pathA);
  const contentB = readFile(pathB);

  const objA = JSON.parse(contentA);
  const objB = JSON.parse(contentB);

  return compareObjects(objA, objB);
};
