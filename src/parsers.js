import yaml from 'js-yaml';

export default (content, filetype) => {
    const yamlExt = ['.yaml', '.yml'];
    let result;
    if (yamlExt.includes(filetype)) {
        result = yaml.load(content);
    } else {
        result = JSON.parse(content)
    }

    return result;
};
