import yaml from 'js-yaml';

const jsonParser = (content) => JSON.parse(content);

const yamlParser = (content) => yaml.load(content);

export default (content, format) => {
  switch (format) {
    case 'json':
      return jsonParser(content);

    case 'yml':
    case 'yaml':
      return yamlParser(content);

    default:
      throw new Error(`Parser not found for this format: ${format}`);
  }
};
