const debug = require("debug")("EmailService:app");
const debugError = require("debug")("EmailService:app:error");
const nodemailer = require("nodemailer");
var Promise = require("bluebird");
var kafkaConsumer = require("./kafka-consumer.js");
const PQueue = require("p-queue");
const queue = new PQueue({ concurrency: 1 });

debug("Starting EmailService...");

let smtpConfig = {
  host: "maildev",
  port: 25,
  ignoreTLS: true
};
let transporter = nodemailer.createTransport(smtpConfig);
var sendMailAsync = Promise.promisify(transporter.sendMail, {
  context: transporter
});

kafkaConsumer.kafkaConsumer.on("message", function(message) {
  debug("message add to queue:" + message);
  queue.add(() =>
    sendMailAsync({
      from: "EmailService@EmailService.com",
      to: "recipient@example.com",
      subject: "Message",
      text: message
    })
      .then(function(info) {
        kafkaConsumer.Commit();
        debug(info);
      })
      .catch(function(err) {
        debugError(err.message);
      })
  );
});
