const config = require('../config.json');

module.exports = (data) => {
	data = data.replace(new RegExp(config.token, 'g'), '-- SENSITIVE INFORMATION --');
	data = data.replace(new RegExp(config.rethinkdb.password, 'g'), '-- SENSITIVE INFORMATION --');
	for (const key in config.api_keys) {
		if (config.api_keys[key] instanceof Object) {
			for (const key2 in config.api_keys[key]) {
				data = data.replace(new RegExp(config.api_keys[key][key2], 'g'), '-- SENSITIVE INFORMATION --');
			}
		} else {
			data = data.replace(new RegExp(config.api_keys[key], 'g'), '-- SENSITIVE INFORMATION --');
		}
	}
	for (const node in config.lavalink.nodes) {
		data = data.replace(new RegExp(config.lavalink.nodes[node].password, 'g'), '-- SENSITIVE INFORMATION --');
	}
	return data;
};