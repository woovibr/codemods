export const update = async () => {
  const jobPostingToUpdate = await JobPosting.findOne({
    _id: fromGlobalId(id).id,
    company,
  });
};
