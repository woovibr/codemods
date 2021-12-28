import { readConfigWebpack } from '../getConfig';

import { defaultConfig } from './defaultMoveConfig';
import { moveFileToPackage } from './moveFileToPackageCore';

(async () => {
  try {
    const configWithoutFullpath = readConfigWebpack(
      'move.config.js',
      defaultConfig,
    );

    await moveFileToPackage(configWithoutFullpath);
  } catch (err) {
    // eslint-disable-next-line
    console.log('error running transforms: ', err);
  }
})();
