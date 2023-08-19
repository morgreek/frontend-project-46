import _ from 'lodash';

const mknode = (name, status = 'tree', values = {}, children = []) => ({
  name,
  status,
  values,
  children,
});

const getDistinctKeys = (objA, objB) => {
  const keysA = _.keys(objA);
  const keysB = _.keys(objB);
  return _.sortBy([...new Set([...keysA, ...keysB])]);
};

const diff = (objA, objB, name) => {
  const keys = getDistinctKeys(objA, objB);
  const children = keys
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
          return [...acc, mknode(key, 'default', { default: valueA })];
        }
        return [...acc, mknode(key, 'updated', { old: valueA, new: valueB })];
      }
      if (hasA) {
        return [...acc, mknode(key, 'removed', { default: valueA })];
      }
      return [...acc, mknode(key, 'added', { default: valueB })];
    }, []);

  return mknode(name, 'tree', {}, children);
};

export default (objA, objB, name) => diff(objA, objB, name);
