import path from 'path';

import getInternalImports from '../getInternalImports/getInternalImports';
import { getRelativePath } from '../subGraph/getRelativePath';
import { getFilename } from '../subGraph/getFilename';

import { runCodemodFile } from '../moveFileToPackage/runCodemodFile';
import getInternalExportsSource from '../moveFileToPackage/getInternalExportsSource';
import { moveFileToPackage } from '../moveFileToPackage/moveFileToPackageCore';

const cwd = process.cwd();

(async () => {
  try {
    const modelRelativePath = 'packages/main/src/models/index.ts';
    const modelsPath = path.join(cwd, modelRelativePath);

    const models = await runCodemodFile(getInternalExportsSource, modelsPath);

    let movedModels = [];

    // eslint-disable-next-line
    console.log({
      models,
    });

    // check if the model has any internal import
    // if not, move to modules
    for (const model of models) {
      const modelpath = getRelativePath(modelsPath, model);
      const modelWithExtension = getFilename(modelpath);

      if (modelWithExtension.includes('.js')) {
        // eslint-disable-next-line
        console.log('we cant move .js files: ', modelpath);
        continue;
      }

      if (!modelWithExtension) {
        // eslint-disable-next-line
        console.log('model not found: ', modelWithExtension);
        continue;
      }

      const internalImports = await runCodemodFile(
        getInternalImports,
        modelWithExtension,
      );

      if (internalImports.length > 0) {
        // eslint-disable-next-line
        const imports = internalImports.map((i) =>
          getRelativePath(modelpath, i.source.value),
        );

        // eslint-disable-next-line
        console.log(
          'sent run codemod on model because it has internal imports',
          {
            model,
            // imports,
          },
        );
        continue;
      }

      // eslint-disable-next-line
      console.log('move model: ', modelpath);

      // /Users/sibelius/Dev/entria/feedback/feedback-server/packages/main/src/modules/companyRequiredDocs/CompanyRequiredDocsModel
      const getDefaultName = (m: string) => {
        const paths = m.split('/');

        const modelName = paths[paths.length - 1];

        if (modelName.includes('Model')) {
          return modelName.replace('Model', '');
        }

        return modelName;
      };

      const modulesPath = '/modules/';

      const getTo = (m: string) => {
        const mPath = m.indexOf(modulesPath);

        const to = m.slice(mPath + modulesPath.length);

        return `packages/modules/src/${to}.ts`;
      };

      if (!modelpath.includes(modulesPath)) {
        // eslint-disable-next-line
        console.log('modelPath is not on modules we cant move');
        continue;
      }

      const from = `${modelpath}.ts`;

      const config = {
        from,
        fromPackage: 'packages/main',
        to: getTo(modelpath),
        toPackage: 'packages/modules',
        toPackageName: '@repo/modules',
        defaultName: getDefaultName(modelpath),
        namespaceName: null,
      };

      // eslint-disable-next-line
      console.log({
        config,
      });

      await moveFileToPackage(config);

      movedModels = [...movedModels, modelpath];
    }

    // eslint-disable-next-line
    console.log({
      movedModels,
    });
  } catch (err) {
    // eslint-disable-next-line
    console.log('e', err);
  }

  process.exit(0);
})();
