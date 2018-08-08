const successSlack = require('./lib/success');

async function success(pluginConfig, context) {
  await successSlack(pluginConfig, context);
}

module.exports = {success};
