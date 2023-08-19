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

    if (child.status === 'tree') {
      return `${acc}${formatter(child, paths)}\n`;
    }
    if (child.status === 'updated') {
      const oldValue = stringify(child.values.old);
      const newValue = stringify(child.values.new);
      return `${acc}Property '${paths}' was updated. From ${oldValue} to ${newValue}\n`;
    }
    if (child.status === 'removed') {
      return `${acc}Property '${paths}' was removed\n`;
    }
    if (child.status === 'added') {
      const value = stringify(child.values.default);
      return `${acc}Property '${paths}' was added with value: ${value}\n`;
    }
    return acc;
  }, '')
    .trim();

  return result;
};

export default (diff, name) => formatter(diff, name);
