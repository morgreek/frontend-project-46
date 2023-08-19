import _ from 'lodash';

const repeater = 4;

const indentator = (char, repeat, level = 0) => char.repeat(level * repeat);

const stringify = (object, level, name) => {
  const indent = indentator(' ', repeater, level);
  const startLine = name ? `${indent.slice(0, repeater * (-1))}${name}: {\n` : '{\n';

  const keys = _.keys(object)
    .map((key) => ({ name: key, value: object[key] }))
    .reduce((acc, entry) => {
      if (_.isPlainObject(entry.value)) {
        return `${acc}${stringify(entry.value, level + 1, entry.name)}\n`;
      }
      return `${acc}${indent}${entry.name}: ${entry.value}\n`;
    }, '');

  const result = `${startLine}${keys}${indent.slice(0, repeater * (-1))}}`;
  return result;
};

const convertValue = (value, level) => {
  if (_.isPlainObject(value)) {
    return stringify(value, level);
  }
  return value;
};

const getSpecSymbols = (status) => {
  const added = '+ ';
  const removed = '- ';
  const noChanges = '  ';

  switch (status) {
    case 'added':
      return added;

    case 'removed':
      return removed;

    default:
      return noChanges;
  }
};

const makeLine = (indent, status, name) => {
  const spec = getSpecSymbols(status);
  return `${indent.slice(0, -spec.length)}${spec}${name}`;
};

const formatter = (diff, level = 0) => {
  const indent = indentator(' ', repeater, level);
  if (diff.status === 'tree') {
    const startLine = diff.name ? `${makeLine(indent, diff.status, diff.name)}: {\n` : '{\n';
    const endLine = diff.name ? `${indent}}\n` : '}';
    const childs = diff.children.reduce((acc, child) => `${acc}${formatter(child, level + 1)}`, '');
    return `${startLine}${childs}${endLine}`;
  } if (diff.status === 'updated') {
    const valueA = convertValue(diff.values.old, level + 1);
    const valueB = convertValue(diff.values.new, level + 1);
    const lineA = `${makeLine(indent, 'removed', diff.name)}: ${valueA}\n`;
    const lineB = `${makeLine(indent, 'added', diff.name)}: ${valueB}\n`;
    return `${lineA}${lineB}`;
  }
  const value = convertValue(diff.values.default, level + 1);
  return `${makeLine(indent, diff.status, diff.name)}: ${value}\n`;
};

export default (diff, level) => formatter(diff, level);
