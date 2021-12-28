import FeatureFlag, { FeatureFlagProps } from './FeatureFlag';
import { FeatureTemp_company } from './__generated__/FeatureTemp_company.graphql';

type Props = {
  company: FeatureTemp_company;
} & FeatureFlagProps;

const FeatureTemp = ({ features, ...props }: Props) => {
  const company = useFragment<FeatureTemp_company$key>(graphql`
    fragment FeatureTemp_company on Company {
      ...FeatureFlag_company
    }
  `, props.company);

  return <FeatureFlag features={[MODULES.TEMP]} {...props} />;
};

export default FeatureTemp;
