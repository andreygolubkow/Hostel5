const config = require('./config');

config.port = process.env.PORT || config.port || 8080;

module.exports = config;
