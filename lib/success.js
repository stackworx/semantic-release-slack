const {WebClient} = require('@slack/client');

const debug = require('debug')('semantic-release-slack');
const resolveConfig = require('./resolve-config');
const getRepoId = require('./get-repo-id');

// TODO include in get config
const slackToken = process.env.SLACK_TOKEN;

const slackClient = new WebClient(slackToken);

module.exports = async (pluginConfig, context) => {
  const {
    options: {repositoryUrl},
    nextRelease: {gitTag, gitHead, notes},
    logger,
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

  await slackClient.chat.postMessage({
    channel: '#slack-testing',
    text: `woohoo a release ${gitTag}, Notes: ${notes}`,
  });

  logger.log('Slack Message Sent');
};
