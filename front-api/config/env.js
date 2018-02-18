/**
 * Env Variables, default is EnvDev
 * Change env using NODE_ENV
 *
 *	export NODE_ENV=production
 *	set NODE_ENV=production
 *
 */

var EnvDev = {
	name: "dev",
	host: "localhost",
	OriginUrl: "*",
	port: 4343
};

var EnvRelease = {
	name: "staging",
	host: "localhost",
	OriginUrl: "*",
	port: 4343
};

var EnvProd = {
	name: "production",
	host: "localhost",
	OriginUrl: "*",
	port: 4343
};

var EnvList = [EnvDev, EnvRelease, EnvProd];

function GetCurrentEnv() {
	var CurEnv = EnvDev;
	if (process.env.NODE_ENV) {
		CurEnv = EnvList.find(env => {
			return env.name === process.env.NODE_ENV;
		});
	}
	return CurEnv || EnvProd;
}

var CurrentEnv = GetCurrentEnv();
module.exports = {
	CurrentEnv: CurrentEnv
};
