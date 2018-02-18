// Requirements
var morgan = require("morgan");
var debug = require("debug")("Api:config:logger");

/**
 * Load Morgan Logger
 *
 *
 *
 *
 *
 */

module.exports = function(app) {
	// Initialize
	var logLevel = "dev";

	// Check environment
	if (process.env.NODE_ENV === "production") {
		// Update log level
		logLevel = "common";
	}

	// Do use logs
	debug("Use Morgan to log requests with level:", logLevel);
	app.use(morgan(logLevel));
};
