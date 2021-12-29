import path from 'path';

import { Options } from 'jscodeshift';

const cwd = process.cwd();

export const requireDynamically = (p: string) => eval(`require('${p}');`); // Ensure Webpack does not analyze the require statement

export const readConfigWebpack = (
  configFilename: string,
  defaultConfig: Record<string, unknown>,
) => {
  try {
    const configPath = path.join(cwd, configFilename);
    const config = requireDynamically(configPath);

    return config;
  } catch (e) {
    // eslint-disable-next-line
    console.log('Config not found: ', e);
    return defaultConfig;
  }
};

export const readConfigFile = (
  configFilename: string,
  defaultConfig: Record<string, unknown>,
) => {
  try {
    const configPath = path.join(cwd, configFilename);
    const config = require(configPath); // eslint-disable-line

    return config;
  } catch (e) {
    // eslint-disable-next-line
    console.log('Config not found: ', e);
    return defaultConfig;
  }
};

export const getConfig = <Config extends object>(
  options: Options,
  defaultConfig: Record<string, unknown> = {},
): Config => {
  if (options.testConfig) {
    return options.testConfig;
  }

  if (!options.config) {
    return defaultConfig;
  }

  return readConfigFile(options.config, defaultConfig);
};
