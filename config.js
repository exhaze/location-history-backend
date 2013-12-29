var url = require('url');

if (!process.env.DATABASE_URL || !url.parse(process.env.DATABASE_URL)) {

	if(process.env.HEROKU_POSTGRESQL_COPPER_URL) {
		process.env.DATABASE_URL = process.env.HEROKU_POSTGRESQL_COPPER_URL
	} else {
	    badger.error('$DATABASE_URL not set, please set it! (e.g. postgres://user:password@127.0.0.1:5432/database)')
    	process.exit(1)
    }
}

var dbUrl = url.parse(process.env.DATABASE_URL);

var config = {
	db: {
		url: dbUrl,
		host: dbUrl.hostname,
		name: dbUrl.path.substr(1),
		user: dbUrl.auth.split(':')[0],
		password: dbUrl.auth.split(':')[1],
		port: dbUrl.port,
		logging: console.log,
		connections: 20,
		maxIdleTime: 30
	},

	token: process.env.TOKEN
};

module.exports = config;

