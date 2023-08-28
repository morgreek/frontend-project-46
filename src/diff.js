import _ from 'lodash';

const genNode = (parameters) => ({
  name: null,
  status: 'tree',
  values: {},
  children: [],
  ...parameters,
});

const getDistinctKeys = (objA, objB) => {
  const keysA = _.keys(objA);
  const keysB = _.keys(objB);
  return _.sortBy([...new Set([...keysA, ...keysB])]);
};

export const genDiff = (objA, objB, name) => {
  const keys = getDistinctKeys(objA, objB);
  const children = keys
    .reduce((acc, key) => {
      const valueA = objA[key];
      const valueB = objB[key];

      const isObjectA = _.isPlainObject(valueA);
      const isObjectB = _.isPlainObject(valueB);

      switch (true) {
        case isObjectA && isObjectB:
          return [...acc, genDiff(valueA, valueB, key)];

        case valueA !== undefined && valueB === undefined:
          return [...acc, genNode({ name: key, status: 'removed', values: { default: valueA } })];

        case valueA === undefined && valueB !== undefined:
          return [...acc, genNode({ name: key, status: 'added', values: { default: valueB } })];

        case valueA !== valueB:
          return [...acc, genNode({ name: key, status: 'updated', values: { old: valueA, new: valueB } })];

        case _.isEqual(valueA, valueB):
          return [...acc, genNode({ name: key, status: 'default', values: { default: valueA } })];

        default:
          throw new Error(`Error at switch comparsion statements - key: ${key} | valueA: ${valueA} | valueB: ${valueB}`);
      }
    }, []);

  return genNode({ name, status: 'tree', children });
};
