import FeatureFlag, { FeatureFlagProps } from './FeatureFlag';
import { FeatureTemp_company } from './__generated__/FeatureTemp_company.graphql';

type Props = {
  company: FeatureTemp_company;
} & FeatureFlagProps;

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
