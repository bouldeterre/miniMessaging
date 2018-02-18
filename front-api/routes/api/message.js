// Requirements
var ApiResponse = require(__base + "/models/response/ApiResponse.js");
var debug = require("debug")("Api:routes:api:message");

module.exports = function(req, res) {
	if (!req.body) {
		return res
			.status(200)
			.json(new ApiResponse("ko", 400, "Bad Request: Body not found"));
	}
	debug("message with body:" + req.body);

	var payloads = [{ topic: "T", messages: req.body }];

	try {
		req.app.kafkaProducer.send(payloads, function(err) {
			if (err) {
				return res.status(200).json(ApiResponse("ko", 500, err.message));
			}
			res.status(200).json(new ApiResponse("ok", 200, ""));
		});
	} catch (e) {
		return res.status(200).json(ApiResponse("ko", 500, e.message));
	}
};
