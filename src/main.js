import _ from 'lodash';

const mknode = (name, status, ...childs) => ({ name, status, children: childs });

const mkleaf = (name, status, value) => ({ name, status, value });

const addChildren = (node, ...childs) => node.children.concat(childs);

const convertToNode = (name, status, object) => {
  const result = mknode(name, status);
  let child;
  const keys = _.keys(object);
  const keysCount = keys.length;
  for (let i = 0; i < keysCount; i += 1) {
    if (object[keys[i]].constructor === Object) {
      child = convertToNode(keys[i], 'default', object[keys[i]]);
    } else {
      child = mkleaf(keys[i], 'default', object[keys[i]]);
    }
    result.children = addChildren(result, child);
  }

  return result;
};

const convertToChild = (name, status, value) => {
  let child;
  if (_.isPlainObject(value)) {
    child = convertToNode(name, status, value);
  } else if (_.isArray(value)) {
    child = mkleaf(name, status, `[${value}]`);
  } else {
    child = mkleaf(name, status, value);
  }

  return child;
};

const diff = (objA, objB, nodeName) => {
  const statuses = {
    default: 'default',
    add: 'added',
    remove: 'removed',
    update: 'updated',
  };

  const result = mknode(nodeName, statuses.default);

  const keysA = _.keys(objA);
  const keysB = _.keys(objB);
  const allKeys = [...new Set([...keysA, ...keysB])].sort();
  const keysLength = allKeys.length;

  for (let i = 0; i < keysLength; i += 1) {
    // Обход каждого ключа
    const key = allKeys[i];
    const hasKeyA = _.has(objA, key);
    const hasKeyB = _.has(objB, key);

    const valueA = hasKeyA ? objA[key] : null;
    const valueB = hasKeyB ? objB[key] : null;

    const isObjectA = _.isPlainObject(valueA);
    const isObjectB = _.isPlainObject(valueB);

    if (hasKeyA && hasKeyB) {
      if (isObjectA && isObjectB) {
        // Объект, сравнение по внутренним ключам
        result.children = addChildren(result, diff(valueA, valueB, key));
      } else if (isObjectA) {
        const childA = convertToNode(key, statuses.remove, valueA);
        const childB = mkleaf(key, statuses.add, valueB);
        result.children = addChildren(result, childA, childB);
      } else if (_.isArray(valueA)) {
        if (_.isEqual(valueA, valueB)) {
          const child = mkleaf(key, statuses.default, `[${valueA}]`);
          result.children = addChildren(result, child);
        } else {
          const childA = mkleaf(key, statuses.remove, `[${valueA}]`);
          const childB = convertToChild(key, statuses.add, valueB);
          result.children = addChildren(result, childA, childB);
        }
      } else if (valueA === valueB) {
        const child = mkleaf(key, statuses.default, valueA);
        result.children = addChildren(result, child);
      } else {
        const childA = mkleaf(key, statuses.remove, valueA);
        const childB = mkleaf(key, statuses.add, valueB);
        result.children = addChildren(result, childA, childB);
      }
    } else if (hasKeyA) {
      // Ключ только у первого объекта - значение удалено
      const child = convertToChild(key, statuses.remove, valueA);
      result.children = addChildren(result, child);
    } else {
      // Ключ только у второго объекта - значение добавлено
      const child = convertToChild(key, statuses.add, valueB);
      result.children = addChildren(result, child);
    }
  }

  return result;
};

export default (objA, objB, name) => diff(objA, objB, name);
