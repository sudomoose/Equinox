const rethinkdb = require('rethinkdbdash');
const metrics = require('datadog-metrics');
const Client = require('./Client');
const Website = require('./Website');
const config = require('./config.json');

const r = rethinkdb(config.rethinkdb);
const bot = new Client({
	token: config.token,
	clientOptions: config.client_options,
	rethinkdb: r,
	metrics: metrics
});
const website = new Website(bot.bot, r, metrics);

bot.launch();
website.launch();