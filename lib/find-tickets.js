module.exports = (commits, projectId = 'BLMP') => {
  const regex = RegExp(`(?:Resolves|Closes|Fixes) (${projectId}-\\d+)`, 'i');

  const tickets = commits
    .map((commit) => {
      const result = regex.exec(commit.message);

      if (result) {
        return result[1];
      }

      return null;
    })
    .filter((message) => !!message);

  // Remove duplicates and sort
  return Array.from(new Set(tickets)).sort();
};
