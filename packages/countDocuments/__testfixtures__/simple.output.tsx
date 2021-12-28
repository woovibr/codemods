(async () => {
  const userCount = await User.countDocuments(conditions);
})();