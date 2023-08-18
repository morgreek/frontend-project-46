import _ from 'lodash';

const repeater = 4;

const indentator = (char, repeat, level = 0) => char.repeat(level * repeat);

const stringify = (object, level, name) => {
  const indent = indentator(' ', repeater, level);
  let result;
  if (name) {
    result = [`${indent.slice(0, repeater * (-1))}${name}: {`];
  } else {
    result = ['{'];
  }

  const keys = _.keys(object);
  const count = keys.length;
  for (let i = 0; i < count; i += 1) {
    const key = keys[i];
    const value = object[key];
    if (_.isPlainObject(value)) {
      result.push(stringify(value, level + 1, key));
    } else {
      result.push(`${indent}${key}: ${value}`);
    }
  }
  result.push(`${indent.slice(0, repeater * (-1))}}`);
  return result.join('\n');
};

const convertValue = (value, level) => {
  if (_.isPlainObject(value)) {
    return stringify(value, level);
  }
  return value;
};

const formatter = (diff, level = 0) => {
  const added = '+ ';
  const removed = '- ';
  const noChanges = '  ';
  const indent = indentator(' ', repeater, level);

  const result = [];

  let spec;
  switch (diff.status) {
    case 'added':
      spec = added;
      break;

    case 'removed':
      spec = removed;
      break;

    default:
      spec = noChanges;
      break;
  }

  if (diff.status === 'tree') {
    if (diff.name) {
      result.push(`${indent.slice(0, -spec.length)}${spec}${diff.name}: {`);
    } else {
      result.push('{');
    }
    diff.children.forEach((child) => result.push(formatter(child, level + 1)));
    if (diff.name) {
      result.push(`${indent}}`);
    } else {
      result.push('}');
    }
  } else if (diff.status === 'updated') {
    const valueA = convertValue(diff.values.old, level + 1);
    const valueB = convertValue(diff.values.new, level + 1);

    result.push(`${indent.slice(0, -removed.length)}${removed}${diff.name}: ${valueA}`);
    result.push(`${indent.slice(0, -added.length)}${added}${diff.name}: ${valueB}`);
  } else {
    const value = convertValue(diff.values.default, level + 1);
    result.push(`${indent.slice(0, -spec.length)}${spec}${diff.name}: ${value}`);
  }

  return result.join('\n');
};

export default (diff, level) => formatter(diff, level);
