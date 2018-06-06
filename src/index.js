const rethinkdb = require('rethinkdbdash');
const metrics = require('datadog-metrics');
const path = require('path');
const i18n = require('i18n');
const Client = require('./Client');
const Website = require('./Website');
const config = require('./config.json');

i18n.configure({
	directory: path.join(__dirname, '..', 'locales'),
	updateFiles: false,
	autoReload: true,
	defaultLocale: config.default_locale,
	objectNotation: true
});

const r = rethinkdb(config.rethinkdb);
const bot = new Client({
	token: config.token,
	clientOptions: config.client_options,
	rethinkdb: r,
	metrics,
	i18n
});
const website = new Website(bot.bot, r, metrics);

bot.launch();
website.launch();