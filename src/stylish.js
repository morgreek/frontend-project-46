const formatter = (diff, level) => {
    const repeat = 4;
    const indent = ' ';
    const added = '+ ';
    const removed = '- ';
    const def = '  ';

    const result = [];
    // глубина * количество отступов — смещение влево
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
    if (Object.hasOwn(diff, 'children')) {
        if (!!diff.name) {
            result.push(`${indent.repeat(level*repeat).slice(0,-spec.length)}${spec}${diff.name}: {`)
        } else {
            result.push('{')
        }
        diff.children.forEach((child) => result.push(formatter(child, level + 1)));
        if (!!diff.name) {
            result.push(`${indent.repeat(level*repeat)}}`)
        } else {
            result.push('}')
        }
    } else {
        result.push(`${indent.repeat(level*repeat).slice(0,-spec.length)}${spec}${diff.name}: ${diff.value}`)
    }
    return result.join('\n');
};

export default (diff, level) => formatter(diff, level);
