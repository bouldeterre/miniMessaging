var debug = require("debug")("Api:config:kafka");
var kafka = require("kafka-node");

/**
 * Load Kafka Producer
 *
 *
 *
 *
 *
 */
module.exports = function(app) {
	debug("Loading kafka...");

	var Producer = kafka.Producer;
	var client = new kafka.Client("zookeeper:2181");
	app.kafkaProducer = new Producer(client);

	app.kafkaProducer.on("ready", function() {
		debug("Kafka producer ready");
	});

	app.kafkaProducer.on("error", function(err) {
		debug(err);
	});
};
