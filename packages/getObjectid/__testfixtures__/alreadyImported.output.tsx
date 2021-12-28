import { getObjectId } from '@repo/graphql';

export const update = async () => {
  const jobPostingToUpdate = await JobPosting.findOne({
    _id: getObjectId(id),
    company,
  });
};
