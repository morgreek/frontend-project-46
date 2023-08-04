import yaml from 'js-yaml';

const jsonParser = (content) => JSON.parse(content);

const yamlParser = (content) => yaml.load(content);

export default (content, extension) => {
  const filetype = extension.startsWith('.') ? extension.slice(1) : extension;

  const jsonExt = ['json'];
  const yamlExt = ['yaml', 'yml'];

  if (jsonExt.includes(filetype)) {
    return jsonParser(content);
  }

  if (yamlExt.includes(filetype)) {
    return yamlParser(content);
  }

  throw new Error(`Parser not found for this extension: ${extension}`);
};
