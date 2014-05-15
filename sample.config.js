/**
*	copy and rename to 'config.js'
*/

var config = {};

config.folder = '/Users/brianrogers/Documents/Brian/photos/';

config.user  = {
	email: 'email@youraddress.com'
	, first: 'First'
	, last: 'Last'
};

config.db = {
	user: 'user'
	, password: 'password'
	, db: 'picmailapp'
	, port: 5432  
	, dialect: 'postgres'
}

//gateway config
config.email = {
	service: 'Gmail'
	, username: 'username@gmail.com'
	, password: 'password'
	, from: 'donotreply@stupidventures.com'
};

Object.freeze(config);

module.exports = config;