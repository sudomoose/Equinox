const snekfetch = require('snekfetch');
const config = require('../config.json');

module.exports = (query) => {
	return new Promise((resolve, reject) => {
		snekfetch.get('http://' + config.lavalink.nodes[0].host + ':2333/loadtracks?identifier=' + query).set('Authorization', config.lavalink.nodes[0].password).then((result) => {
			resolve(result.body);
		}).catch((error) => reject(error));
	});
};