import _ from 'lodash';

const mknode = (name, values = {}, status = 'tree') => ({
  name,
  status,
  values,
  children: [],
});

const getDistinctKeys = (objA, objB) => {
  const keysA = _.keys(objA);
  const keysB = _.keys(objB);
  return [...new Set([...keysA, ...keysB])].sort();
};

const diff = (objA, objB, name) => {
  const result = mknode(name, 'tree');

  const keys = getDistinctKeys(objA, objB);
  const count = keys.length;
  for (let i = 0; i < count; i += 1) {
    const key = keys[i];

    const valueA = objA[key];
    const valueB = objB[key];

    const hasA = _.has(objA, key);
    const hasB = _.has(objB, key);

    const isObjectA = _.isPlainObject(valueA);
    const isObjectB = _.isPlainObject(valueB);

    let child;

    if (hasA && hasB) {
      if (isObjectA && isObjectB) {
        child = diff(valueA, valueB, key);
      } else if (_.isEqual(valueA, valueB)) {
        child = mknode(key, { default: valueA }, 'default');
      } else {
        child = mknode(key, { old: valueA, new: valueB }, 'updated');
      }
    } else if (hasA) {
      child = mknode(key, { default: valueA }, 'removed');
    } else {
      child = mknode(key, { default: valueB }, 'added');
    }

    if (child) {
      result.children.push(child);
    }
  }

  return result;
};

export default (objA, objB, name) => diff(objA, objB, name);
