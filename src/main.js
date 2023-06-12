import _ from 'lodash';

const compareObjects = (objA, objB) => {
    const result = ['{'];

    const keysA = _.keys(objA);
    const keysB = _.keys(objB);
    const allKeys = [... new Set([...keysA, ...keysB])].sort();
    const keysLength = allKeys.length;

    const tabs = '  ';
    const minus = '- ';
    const plus = '+ ';

    for (let i = 0; i < keysLength; i += 1) {
        if (Object.hasOwn(objA, allKeys[i])) {
            if (Object.hasOwn(objB, allKeys[i])) {
                if (objA[allKeys[i]] === objB[allKeys[i]]) {
                    result.push(`${tabs}${tabs}${allKeys[i]}: ${objA[allKeys[i]]}`);
                } else {
                    result.push(`${tabs}${minus}${allKeys[i]}: ${objA[allKeys[i]]}`);
                    result.push(`${tabs}${plus}${allKeys[i]}: ${objB[allKeys[i]]}`);
                }
            } else {
                result.push(`${tabs}${minus}${allKeys[i]}: ${objA[allKeys[i]]}`);
            }
        } else {
            result.push(`${tabs}${plus}${allKeys[i]}: ${objB[allKeys[i]]}`);
        }
    }

    result.push('}');

    return result.join('\n');
};

export const compareStrings = (strA, strB) => {
    const a = JSON.parse(strA);
    const b = JSON.parse(strB);

    return compareObjects(a, b);
};
