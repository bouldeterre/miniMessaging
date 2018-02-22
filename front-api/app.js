// Set global directory
global.__base = __dirname + "/";

// Launch router with config and routes
require(__base + "modules/router.js")("./config.json", "./config/routes.js");
