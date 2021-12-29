import { moveFileToPackage } from '../moveFileToPackage/moveFileToPackageCore';

type MoveConfigFixture = {
  from: string;
  to: string;
};
const moveConfig = ({ from, to }: MoveConfigFixture) => ({
  from,
  fromPackage: 'packages/main',
  to,
  toPackage: 'packages/modules',
  toPackageName: '@repo/modules',
  defaultName: null,
  namespaceName: null,
  softNamedImportFromSource: true,
});

const themesPath = 'packages/main/src/modules/theme/default';
const modulePath = 'packages/modules/src/theme/default';

const themes = [
  {
    from: `${themesPath}/CarbonoTheme`,
    to: `${modulePath}/CarbonoTheme`,
  },
  {
    from: `${themesPath}/DefaultTheme`,
    to: `${modulePath}/DefaultTheme`,
  },
  {
    from: `${themesPath}/OrangeTheme`,
    to: `${modulePath}/OrangeTheme`,
  },
  {
    from: `${themesPath}/NightTheme`,
    to: `${modulePath}/NightTheme`,
  },
  {
    from: `${themesPath}/CherryTheme`,
    to: `${modulePath}/CherryTheme`,
  },
  {
    from: `${themesPath}/GreenOilTheme`,
    to: `${modulePath}/GreenOilTheme`,
  },
  {
    from: `${themesPath}/GreenFlagTheme`,
    to: `${modulePath}/GreenFlagTheme`,
  },
].map((c) => ({
  from: `${c.from}.ts`,
  to: `${c.to}.ts`,
}));

(async () => {
  try {
    // eslint-disable-next-line
    console.log(`moving ${themes.length} themes files`);
    for (const theme of themes) {
      const config = moveConfig(theme);

      // eslint-disable-next-line
      console.log({
        config,
      });

      await moveFileToPackage(config);
    }
  } catch (err) {
    // eslint-disable-next-line
    console.log('e', err);
  }

  process.exit(0);
})();
