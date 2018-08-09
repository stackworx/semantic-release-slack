const {WebClient} = require('@slack/client');

const debug = require('debug')('semantic-release-slack');
const JiraApi = require('jira-client');

const resolveConfig = require('./resolve-config');
const getRepoId = require('./get-repo-id');

const findTickets = require('./find-tickets');
const removeLinks = require('./remove-links');

const {SLACK_TOKEN, SLACK_CHANNEL, JIRA_USERNAME, JIRA_PASSWORD} = process.env;

const jira = new JiraApi({
  protocol: 'https',
  host: 'https://stackworx.atlassian.net',
  username: JIRA_USERNAME,
  password: JIRA_PASSWORD,
  apiVersion: '2',
  strictSSL: true,
});

const slackClient = new WebClient(SLACK_TOKEN);

module.exports = async (pluginConfig, context) => {
  const {
    options: {repositoryUrl},
    env: {CI_PROJECT_URL, CI_PROJECT_NAME, CI_PIPELINE_ID, CI_PIPELINE_URL},
    nextRelease: {gitTag, gitHead},
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

  const issueIds = findTickets(commits);

  for (const issueId of issueIds) {
    try {
      logger.log(`Updating Issue: ${issueId}...`);
      await jira.addComment(
        issueId,
        `Released in [${gitTag}](${tagUrl}). (Pipeline ${CI_PIPELINE_ID})[${CI_PIPELINE_URL}].`
      );
      await jira.updateIssue(issueId, {
        update: {labels: [{set: gitTag}]},
      });
      logger.log(`Done.`);
    } catch (ex) {
      logger.fatal(ex);
    }
  }

  const slackText = `Tickets Published ${
    issueIds.length > 0 ? issueIds.join(', ') : 'None'
  }`;

  const message = {
    channel: SLACK_CHANNEL,
    text: `Automated Release Generated for ${CI_PROJECT_NAME}`,
    attachments: [
      {
        fallback: `Issues Published: ${issueIds.join(', ')}`,
        color: '#36a64f',
        title: gitTag,
        title_link: tagUrl,
        text: slackText,
      },
    ],
  };

  // console.log(JSON.stringify(message, null, 2));

  await slackClient.chat.postMessage(message);

  logger.log('Slack Message Sent');
};
