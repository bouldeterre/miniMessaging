var configurer = require("./configurer.js");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var debug = require("debug")("Api:modules:router");
var Env = require(__base + "/config/env.js").CurrentEnv;

debug("Initialize router");

/**
 * Render a simple HTML view
 *
 * @param (string) viewFile         Filename of view to load
 *
 * @return (function) Rendered view
 */
function createRenderer(view) {
	// Just render view
	return function(req, res) {
		res.render(view, req.params);
	};
}

/**
 * Load list of actions files
 *
 * @param (Array) actionsFiles     Actions files to load
 *
 * @return (Array) Actions to execute
 */
function loadActionsFiles(actionsFiles) {
	// Initialize
	var actions = [];
	var action, file, ext;

	// Check actionsFiles
	if (typeof actionsFiles === "string") {
		// Set as array
		actionsFiles = [actionsFiles];
	}

	// Loop on actions to load
	actionsFiles.forEach(function(p) {
		// Initialize : check extension
		ext = path.extname(p);
		try {
			// Check HTML display
			if (ext === ".html") {
				// Do render page
				action = createRenderer(p);
			} else if (ext === "") {
				action = require(path.resolve(p + ".js"));
			} else {
				file = path.resolve(path.dirname(p) + "/" + path.basename(p, ext));
				action = require(file)[ext.substr(1)];
			}
		} catch (e) {
			debug("requireF(): The file " + file + " couldn't be loaded.");
			debug(e.message);
			throw e;
		}

		// Check action
		if (typeof action !== "function") {
			debug("Invalid route:", p);
			process.exit(1);
		}

		// Add action to actions list
		actions.push(action);
	});

	// Return actions list
	return actions;
}

/**
 * Initialize all routes
 *
 * @param (App) app                 Main application
 * @param (string) routesFile       Routes configuration's file
 */
function initializeRoutes(app, routesFile) {
	// Initialize
	var routes = require(path.resolve(routesFile));
	var reg = /(\S+)\s+(\S+)/;
	var r, method, url, params;

	// Loop on routes
	for (r in routes) {
		// Check unwanted properties
		if (!routes.hasOwnProperty(r)) {
			// Don't add route
			continue;
		}

		// Check route
		if (!reg.test(r)) {
			// Route is invalid
			debug("Route " + r + " is invalid!");
			continue;
		}

		// Initialize route
		method = RegExp.$1.toLowerCase();
		url = RegExp.$2;
		params = routes[r];

		// Check method
		if (typeof app[method] !== "function") {
			// Method is invalid
			debug("Method " + method + " is invalid!");
			continue;
		}

		// Load action file
		var loadFile = loadActionsFiles(params.loadFile)[0];

		app[method](url, loadFile);
	}
}

/**
 * Create router
 *
 * @param (string) configFile       Main configuration's file
 * @param (string) routesFile       Routes configuration's file
 *
 * @return (Object) Main router
 */
module.exports = function(configFile, routesFile) {
	// Initialize
	var _router = this || {};

	debug("Load router");

	// Create app
	_router.app = express();

	_router.app.use(function(req, res, next) {
		res.header("Access-Control-Allow-Credentials", "true");
		res.header("Access-Control-Allow-Origin", Env.OriginUrl);
		res.header("Access-Control-Allow-Methods", "GET, POST");
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
		next();
	});

	// Do initialize body parser
	_router.app.use(bodyParser.urlencoded({ extended: true }));
	_router.app.use(bodyParser.raw());
	_router.app.use(bodyParser.text());

	// Do load configurer (to load configuration file)
	configurer(_router.app, configFile, function(err) {
		debug("Use configurer");

		if (err) {
			debug(err);
		}

		// Initialize routes
		initializeRoutes(_router.app, routesFile);

		// Launch app
		_router.app.listen(_router.app.get("port"), function(err) {
			if (err) {
				debug(err);
			}
			debug("Router listen to port " + _router.app.get("port"));
		});
	});

	// Return router
	return _router;
};
