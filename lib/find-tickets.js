module.exports = (commits, projectId = 'BLMP') => {
  const regex = RegExp(`(?:Resolves|Closes|Fixes) (${projectId}-\\d+)`, 'i');

  return commits
    .map((commit) => {
      const result = regex.exec(commit.message);

      if (result) {
        return result[1];
      }

      return null;
    })
    .filter((message) => !!message);
};
