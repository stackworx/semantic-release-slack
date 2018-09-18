module.exports = (commits, projectId = 'BLMP') => {
  const regex = RegExp(`(?:Resolves|Closes|Fixes) (${projectId}-\\d+)`, 'ig');

  let tickets = commits.map((commit) => {
    const matches = [];

    debugger;

    while ((match = regex.exec(commit.message)) != null) {
      console.log('match', match);
      matches.push(match[1]);
    }

    return matches;
  });
  // Flattn Arrays
  tickets = [].concat.apply([], tickets);

  // Remove duplicates and sort
  return Array.from(new Set(tickets)).sort();
};
