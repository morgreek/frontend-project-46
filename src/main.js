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
  return _.sortBy([...new Set([...keysA, ...keysB])]);
};

const diff = (objA, objB, name) => {
  const result = mknode(name, 'tree');

  const keys = getDistinctKeys(objA, objB);
  result.children = keys
    .reduce((acc, key) => {
      const valueA = objA[key];
      const valueB = objB[key];

      const hasA = _.has(objA, key);
      const hasB = _.has(objB, key);

      const isObjectA = _.isPlainObject(valueA);
      const isObjectB = _.isPlainObject(valueB);

      if (hasA && hasB) {
        if (isObjectA && isObjectB) {
          return [...acc, diff(valueA, valueB, key)];
        }
        if (_.isEqual(valueA, valueB)) {
          return [...acc, mknode(key, { default: valueA }, 'default')];
        }
        return [...acc, mknode(key, { old: valueA, new: valueB }, 'updated')];
      }
      if (hasA) {
        return [...acc, mknode(key, { default: valueA }, 'removed')];
      }
      return [...acc, mknode(key, { default: valueB }, 'added')];
    }, []);

  return result;
};

export default (objA, objB, name) => diff(objA, objB, name);
