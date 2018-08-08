const {WebClient} = require('@slack/client');

const debug = require('debug')('semantic-release-slack');
const resolveConfig = require('./resolve-config');
const getRepoId = require('./get-repo-id');
const findTickets = require('./find-tickets');

// TODO include in get config
const slackToken = process.env.SLACK_TOKEN;

const slackClient = new WebClient(slackToken);

module.exports = async (pluginConfig, context) => {
  const {
    options: {repositoryUrl},
    env: {CI_PROJECT_URL, CI_PROJECT_NAME},
    nextRelease: {gitTag, gitHead, notes},
    logger,
    commits,
  } = context;

  const {/*gitlabToken,*/ gitlabUrl /*, gitlabApiPathPrefix*/} = resolveConfig(
    pluginConfig,
    context
  );
  const repoId = getRepoId(gitlabUrl, repositoryUrl);
  // const encodedRepoId = encodeURIComponent(repoId);
  // const apiUrl = urlJoin(gitlabUrl, gitlabApiPathPrefix);
  // const encodedGitTag = encodeURIComponent(gitTag);

  debug('repoId: %o', repoId);
  debug('release name: %o', gitTag);
  debug('release ref: %o', gitHead);
  debug('release ref: %o', gitHead);

  const tagUrl = `${CI_PROJECT_URL}/tags/${gitTag}`;

  const ticketIds = findTickets(commits);

  await slackClient.chat.postMessage({
    channel: '#slack-testing',
    text: `Automated Release Generated for ${CI_PROJECT_NAME}`,
    attachments: [
      {
        fallback: notes,
        color: '#36a64f',
        author_name: 'StackBot',
        title: `${gitTag} Created`,
        title_link: tagUrl,
        text: notes,
      },
      {
        fallback: `Tickets Published: ${ticketIds.join(', ')}`,
        color: '#36a64f',
        author_name: 'StackBot',
        text: `Tickets Published: ${ticketIds.join(', ')}`,
      },
    ],
  });

  logger.log('Slack Message Sent');
};
