const config = require('../config.json');

module.exports = (data) => {
	data = data.replace(new RegExp(config.token, 'g'), '-- SENSITIVE INFORMATION --');
	data = data.replace(new RegExp(config.rethinkdb.password, 'g'), '-- SENSITIVE INFORMATION --');
	data = data.replace(new RegExp(config.webhooks.guilds.token, 'g'), '-- SENSITIVE INFORMATION --');
	data = data.replace(new RegExp(config.webhooks.commands.token, 'g'), '-- SENSITIVE INFORMATION --');
	for (const key in config.api_keys) {
		data = data.replace(new RegExp(config.api_keys[key], 'g'), '-- SENSITIVE INFORMATION --');
	}
	for (const node in config.lavalink.nodes) {
		data = data.replace(new RegExp(config.lavalink.nodes[node].password, 'g'), '-- SENSITIVE INFORMATION --');
	}
	return data;
};