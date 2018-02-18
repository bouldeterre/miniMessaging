/**
 * KafkaConsumer
 *
 * export:
 *  kafkaConsumer : An EventEmitter, emitting "message" with the decoded message
 *  Commit: a function for commit current offset
 *
 *
 */
const debug = require("debug")("SlackService:kafka-consumer");
const debugError = require("debug")("SlackService:kafka-consumer:error");
var kafka = require("kafka-node");
const EventEmitter = require("events");

debug("Starting kafkaConsumer");

client = new kafka.Client("zookeeper:2181");

var ConsumerGroup = kafka.ConsumerGroup;

const kafkaConsumerEmiter = new EventEmitter();

let options = {
  host: "zookeeper:2181",
  kafkaHost: "kafka:9092",
  autoCommit: false,
  groupId: "group1",
  sessionTimeout: 10000,
  protocol: ["roundrobin"],
  encoding: "utf8"
};

var consumer = new ConsumerGroup(options, "T");

consumer.on("message", function(message) {
  try {
    // Read string into a buffer.
    var buf = new Buffer(message.value, "binary");
    var decodedMessage = buf.toString();
    debug("Got Message:" + decodedMessage);
    kafkaConsumerEmiter.emit("message", decodedMessage);
  } catch (e) {
    debugError(e.message);
  }
});

function Commit() {
  process.nextTick(() => {
    consumer.commit(function(err, data) {
      if (err) debugError(err.message);
    });
  });
}

function Pause() {
  consumer.pause();
}

function Resume() {
  consumer.resume();
}

consumer.on("error", function(err) {
  debugError(err.message);
  throw err;
});

consumer.on("offsetOutOfRange", function(err) {
  debugError(err);
});

process.on("SIGINT", function() {
  debug("closing kafka client");
  consumer.close(true, function() {
    process.exit();
  });
});

process.on("exit", function() {
  debug("closing kafka client");
  consumer.close(true, function() {
    process.exit();
  });
});

module.exports = {
  kafkaConsumer: kafkaConsumerEmiter,
  Commit: Commit,
  Pause: Pause,
  Resume: Resume
};
