const snekfetch = require('snekfetch');

class WebhookClient {
	constructor(id, token) {
		this._id = id;
		this._token = token;
	}

	send(content) {
		return new Promise((resolve, reject) => {
			if (content instanceof Object) {
				snekfetch.post('https://discordapp.com/api/webhooks/' + this._id + '/' + this._token + '?wait=true').send({
					embeds: [
						content
					]
				}).then(resolve.bind(this)).catch(reject.bind(this));
			} else {
				snekfetch.post('https://discordapp.com/api/webhooks/' + this._id + '/' + this._token + '?wait=true').send({ content }).then(resolve.bind(this)).catch(reject.bind(this));
			}
		});
	}
}

module.exports = WebhookClient;