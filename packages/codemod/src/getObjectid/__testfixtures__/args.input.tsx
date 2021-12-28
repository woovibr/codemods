export const update = async () => {
  const jobPostingToUpdate = await JobPosting.findOne({
    _id: fromGlobalId(args.job).id,
    company,
  });
};
