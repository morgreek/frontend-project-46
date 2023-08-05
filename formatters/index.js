import stylish from './stylish.js';
import plain from './plain.js';

export default (diff, type) => {
  if (type === 'stylish') {
    return stylish(diff, 0);
  }

  if (type === 'plain') {
    return plain(diff);
  }

  if (type === 'json') {
    return JSON.stringify([diff]);
  }

  throw new Error(`Formatter type not found: ${type}`);
};
