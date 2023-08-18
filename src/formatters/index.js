import stylish from './stylish.js';
import plain from './plain.js';

const formattesLib = new Map();
formattesLib.set('stylish', stylish);
formattesLib.set('plain', plain);
formattesLib.set('json', JSON.stringify);

export default (diff, type) => {
  if (formattesLib.has(type)) {
    return formattesLib.get(type)(diff);
  }

  throw new Error(`Formatter type not found: ${type}`);
};
