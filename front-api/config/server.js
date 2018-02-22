var Env = require(__base + "/config/env.js");

module.exports = function(app) {
	// Initialize server configuration
	app.set("host", Env.CurrentEnv.host);
	app.set("port", Env.CurrentEnv.port);
};
