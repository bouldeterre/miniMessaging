const debug = require("debug")("SlackService:app");
const debugError = require("debug")("SlackService:app:error");
var Promise = require("bluebird");
var Slack = require("slack-node");
var kafkaConsumer = require("./kafka-consumer.js");
const PQueue = require("p-queue");
const queue = new PQueue({ concurrency: 1 });

debug("Starting SlackService...");

var slack = new Slack();

const webhookUri =
  "https://hooks.slack.com/services/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";
slack.setWebhook(webhookUri);
var slackWebhookAsync = Promise.promisify(slack.webhook, {
  context: slack
});

kafkaConsumer.kafkaConsumer.on("message", function(message) {
  debug("message add to queue:" + message);

  queue.add(() =>
    slackWebhookAsync({
      channel: "#random",
      username: "messagingbot",
      text: message
    })
      .then(function(response) {
        if (response.response == "ok") {
          debug(response);
          kafkaConsumer.Commit();
        }
      })
      .catch(function(err) {
        debugError(err);
      })
  );
  debug("END message sent to slack:" + message);
});
