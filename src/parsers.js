import yaml from 'js-yaml';

const jsonParser = (content) => JSON.parse(content);

const yamlParser = (content) => yaml.load(content);

export default (content, format) => {
  const jsonExt = ['json'];
  const yamlExt = ['yaml', 'yml'];

  if (jsonExt.includes(format)) {
    return jsonParser(content);
  }

  if (yamlExt.includes(format)) {
    return yamlParser(content);
  }

  throw new Error(`Parser not found for this format: ${format}`);
};
