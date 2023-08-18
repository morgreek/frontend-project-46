import _ from 'lodash';

const stringify = (value) => {
  let result;
  if (typeof value === 'string') {
    result = `'${value}'`;
  } else if (_.isPlainObject(value)) {
    result = '[complex value]';
  } else {
    result = value;
  }

  return result;
};

const formatter = (diff, parent, acc) => {
  const result = acc ?? [];
  let path = [];
  if (parent) {
    path.push(parent);
  }
  if (_.has(diff, 'name')) {
    path.push(diff.name);
  }
  path = path.join('.');

  if (diff.status === 'tree') {
    diff.children.forEach((child) => {
      formatter(child, path, result);
    });
  } else if (diff.status === 'updated') {
    const oldValue = stringify(diff.values.old);
    const newValue = stringify(diff.values.new);
    result.push(`Property '${path}' was updated. From ${oldValue} to ${newValue}`);
  } else if (diff.status === 'removed') {
    result.push(`Property '${path}' was removed`);
  } else if (diff.status === 'added') {
    const value = stringify(diff.values.default);
    result.push(`Property '${path}' was added with value: ${value}`);
  }

  return result.join('\n');
};

export default (diff, parent) => formatter(diff, parent);
