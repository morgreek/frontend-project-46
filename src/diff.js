import _ from 'lodash';

const getDistinctKeys = (objA, objB) => {
  const keysA = _.keys(objA);
  const keysB = _.keys(objB);
  return _.sortBy([...new Set([...keysA, ...keysB])]);
};

const genDiff = (objA, objB, name) => {
  const keys = getDistinctKeys(objA, objB);
  const children = keys
    .reduce((acc, key) => {
      const valueA = objA[key];
      const valueB = objB[key];

      const isObjectA = _.isPlainObject(valueA);
      const isObjectB = _.isPlainObject(valueB);

      if (isObjectA && isObjectB) {
        return [...acc, genDiff(valueA, valueB, key)];
      }

      if (valueA !== undefined && valueB === undefined) {
        return [...acc, { name: key, status: 'removed', values: { value: valueA } }];
      }

      if (valueA === undefined && valueB !== undefined){
        return [...acc, { name: key, status: 'added', values: { value: valueB } }];
      }

      if (valueA !== valueB){
        return [...acc, { name: key, status: 'updated', values: { old: valueA, new: valueB } }];
      }

      if (_.isEqual(valueA, valueB)){
        return [...acc, { name: key, status: 'same', values: { value: valueA } }];
      }

      throw new Error(`Error at switch comparsion statements - key: ${key} | valueA: ${valueA} | valueB: ${valueB}`);
    }, []);

  return { name, status: 'tree', children };
};

export default genDiff;
