var debug = require("debug")("Api:config:routes");

/**
 * Declared Routes
 *
 *
 *
 *
 *
 */

var routes = {
	"POST /api/message": { loadFile: "routes/api/message" }
};

debug("Initialize project with routes", "\n", routes);

module.exports = routes;
