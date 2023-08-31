import _ from 'lodash';

const stringify = (value) => {
  if (typeof value === 'string') {
    return `'${value}'`;
  } if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  return value;
};

const getKeysChain = (parentName, childName) => [parentName, childName]
  .filter((item) => item)
  .join('.');

const formatter = (diff, name = '') => {
  const result = diff.children.reduce((acc, child) => {
    const paths = getKeysChain(name, child.name);

    switch (child.status) {
      case 'tree': {
        return `${acc}${formatter(child, paths)}\n`;
      }

      case 'updated': {
        const oldValue = stringify(child.values.old);
        const newValue = stringify(child.values.new);
        return `${acc}Property '${paths}' was updated. From ${oldValue} to ${newValue}\n`;
      }

      case 'removed': {
        return `${acc}Property '${paths}' was removed\n`;
      }

      case 'added': {
        const value = stringify(child.values.value);
        return `${acc}Property '${paths}' was added with value: ${value}\n`;
      }

      case 'same': {
        return acc;
      }

      default: {
        throw new Error(`Plain formatter - unknow child status: ${child.status}`);
      }
    }
  }, '')
    .trim();

  return result;
};

export default formatter;
