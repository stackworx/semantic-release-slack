const successSlack = require("./lib/success");

async function success(pluginConfig, context) {
  if (!verified) {
    await verifyGitHub(pluginConfig, context);
    verified = true;
  }
  await successSlack(pluginConfig, context);
}

module.exports = { success };
