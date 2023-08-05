import _ from 'lodash';

const indentator = (char, repeat, level = 0) => char.repeat(level * repeat);

const objectToString = (object, level, name) => {
  const indent = indentator(' ', 4, level);
  let result;
  if (name) {
    result = [`${indent.slice(0, -4)}${name}: {`];
  } else {
    result = ['{'];
  }

  const keys = _.keys(object);
  const count = keys.length;
  for (let i = 0; i < count; i += 1) {
    if (_.isPlainObject(object[keys[i]])) {
      result.push(objectToString(object[keys[i]], level + 1, keys[i]));
    } else {
      result.push(`${indent}${keys[i]}: ${object[keys[i]]}`);
    }
  }
  result.push(`${indent.slice(0, -4)}}`);
  return result.join('\n');
};

const convertValue = (value, level) => {
  if (_.isPlainObject(value)) {
    return objectToString(value, level);
  }
  return value;
};

const formatter = (diff, level) => {
  const added = '+ ';
  const removed = '- ';
  const def = '  ';
  const indent = indentator(' ', 4, level);

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
      spec = def;
      break;
  }

  if (diff.type === 'node') {
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
