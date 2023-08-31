import _ from 'lodash';

const repeater = 4;

const indentator = (char, repeat, level = 0) => char.repeat(level * repeat);

const stringify = (object, level, name) => {
  if (!_.isPlainObject(object)) {
    return object;
  }

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

const getSpecSymbols = (status) => {
  const statuses = new Map([
    ['added', '+ '],
    ['removed', '- '],
    ['noChanges', '  '],
  ]);
  if (statuses.has(status)) {
    return statuses.get(status);
  }
  return statuses.get('noChanges');
};

const makeLine = (indent, status, name) => {
  const spec = getSpecSymbols(status);
  return `${indent.slice(0, -spec.length)}${spec}${name}`;
};

const formatter = (diff, level = 0) => {
  const indent = indentator(' ', repeater, level);
  switch (diff.status) {
    case 'tree': {
      const startLine = diff.name ? `${makeLine(indent, diff.status, diff.name)}: {\n` : '{\n';
      const endLine = diff.name ? `${indent}}\n` : '}';
      const childrens = diff.children.reduce((acc, child) => `${acc}${formatter(child, level + 1)}`, '');
      return `${startLine}${childrens}${endLine}`;
    }

    case 'updated': {
      const valueA = stringify(diff.values.old, level + 1);
      const valueB = stringify(diff.values.new, level + 1);
      const lineA = `${makeLine(indent, 'removed', diff.name)}: ${valueA}\n`;
      const lineB = `${makeLine(indent, 'added', diff.name)}: ${valueB}\n`;
      return `${lineA}${lineB}`;
    }
    case 'added':
    case 'removed':
    case 'same': {
      const value = stringify(diff.values.value, level + 1);
      return `${makeLine(indent, diff.status, diff.name)}: ${value}\n`;
    }

    default: {
      throw new Error(`Stylish formatter - unknow diff status: ${diff.status}`);
    }
  }
};

export default formatter;
