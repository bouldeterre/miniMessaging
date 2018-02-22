// Requirements
var path = require("path");
var debug = require("debug")("Api:modules:configurer");

/**
 * Load a given configuration file
 *
 * @param (Object) app                    Main app
 * @param (string) configFile             Configuration file to load
 *
 * @return (Promise)
 */
var loadConfigFile = function loadConfigFile(app, configFile) {
	return new Promise(function(resolveLoad) {
		// Initialize
		var file = path.resolve(configFile);
		var _configurer = require(file);

		// Check config
		if (typeof _configurer !== "function") {
			debug("Invalid config:", file);
			process.exit(1);
		}

		// Do load config
		_configurer(app);

		// And resolve load
		resolveLoad();
	});
};

/**
 * Main configurer
 * Will load a given configuration file in app and then do callback
 *
 * @param (Object) app                    Main app
 * @param (string) configurationFile      Configuration file to load
 * @param (function) callback             Callback to execute when file is loaded
 *
 * @return (self)
 */
module.exports = function(app, configurationFile, callback) {
	debug("Initialize configurer");

	// Initialize configs
	var configs = require(path.resolve(configurationFile));
	var configsPromises = [];

	// Loop on configuration files
	configs.forEach(function(configFile) {
		// Do add loading promise to configsPromises array
		configsPromises.push(loadConfigFile(app, configFile));
	});

	// When all configuration files are loaded...
	Promise.all(configsPromises)
		.then(() => callback())
		.catch(callback);
};
