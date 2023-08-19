import _ from 'lodash';

const stringify = (value) => {
  if (typeof value === 'string') {
    return `'${value}'`;
  } if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  return value;
};

const formatter = (diff, name = '') => {
  const result = diff.children.reduce((acc, child) => {
    const fullName = [name, child.name]
      .filter((item) => item !== '')
      .join('.');

    if (child.status === 'tree') {
      return `${acc}${formatter(child, fullName)}\n`;
    } if (child.status === 'updated') {
      const oldValue = stringify(child.values.old);
      const newValue = stringify(child.values.new);
      return `${acc}Property '${fullName}' was updated. From ${oldValue} to ${newValue}\n`;
    } if (child.status === 'removed') {
      return `${acc}Property '${fullName}' was removed\n`;
    } if (child.status === 'added') {
      const value = stringify(child.values.default);
      return `${acc}Property '${fullName}' was added with value: ${value}\n`;
    }
    return acc;
  }, '')
    .trim();

  return result;
};

export default (diff) => formatter(diff);
