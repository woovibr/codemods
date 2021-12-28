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
    const loadersRelativePath = 'packages/main/src/loader/loaderRegistry.tsx';
    const loadersPath = path.join(cwd, loadersRelativePath);

    // use another codemod
    const loaders = await runCodemodFile(getInternalExportsSource, loadersPath);

    let movedLoaders = [];

    // eslint-disable-next-line
    console.log({
      loaders,
    });

    // check if the loader has any internal import
    // if not, move to modules
    for (const loader of loaders) {
      const loaderPath = getRelativePath(loadersPath, model);
      const loaderWithExtension = getFilename(loaderPath);

      if (loaderWithExtension.includes('.js')) {
        // eslint-disable-next-line
        console.log('we cant move .js files: ', loaderPath);
        continue;
      }

      if (!loaderWithExtension) {
        // eslint-disable-next-line
        console.log('loader not found: ', loaderWithExtension);
        continue;
      }

      const internalImports = await runCodemodFile(
        getInternalImports,
        loaderWithExtension,
      );

      if (internalImports.length > 0) {
        // eslint-disable-next-line
        const imports = internalImports.map((i) =>
          getRelativePath(loaderPath, i.source.value),
        );

        // eslint-disable-next-line
        console.log(
          'sent run codemod on model because it has internal imports',
          {
            loader,
            // imports,
          },
        );
        continue;
      }

      // eslint-disable-next-line
      console.log('move loader: ', loaderPath);

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

      if (!loaderPath.includes(modulesPath)) {
        // eslint-disable-next-line
        console.log('loaderPath is not on modules we cant move');
        continue;
      }

      const from = `${loaderPath}.ts`;

      const config = {
        from,
        fromPackage: 'packages/main',
        to: getTo(loaderPath),
        toPackage: 'packages/modules',
        toPackageName: '@repo/modules',
        defaultName: null,
        namespaceName: getDefaultName(loaderPath),
      };

      // eslint-disable-next-line
      console.log({
        config,
      });

      await moveFileToPackage(config);

      movedLoaders = [...movedLoaders, loaderPath];
    }

    // eslint-disable-next-line
    console.log({
      movedLoaders,
    });
  } catch (err) {
    // eslint-disable-next-line
    console.log('e', err);
  }

  process.exit(0);
})();
