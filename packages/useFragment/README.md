# useFragment codemod

Transforms this:

```jsx
const FeatureTemp = ({ features, ...props }: Props) => {
  return <FeatureFlag features={[MODULES.TEMP]} {...props} />;
};

export default createFragmentContainer(FeatureTemp, {
  company: graphql`
    fragment FeatureTemp_company on Company {
      ...FeatureFlag_company
    }
  `,
});
```
    
 to
 
 ```jsx
const FeatureTemp = ({ features, ...props }: Props) => {
  const company = useFragment(graphql`
    fragment FeatureTemp_company on Company {
      ...FeatureFlag_company
    }
  `, props.company);
  
  return <FeatureFlag features={[MODULES.TEMP]} {...props} />;
};

export default FeatureTemp;
```

## Usage

find packages/**/src/**/fixture/** -iname '*.ts' -print | xargs jscodeshift -t packages/codemod/src/fixtureUndefined/FixtureUndefined.ts
