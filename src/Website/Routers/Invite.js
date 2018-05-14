const express = require('express');
const config = require('../../config.json');

class Invite {
	constructor(bot, r, metrics) {
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.route = '/invite';
		this.router = express.Router();
		this.setupRoutes();
	}

	setupRoutes() {
		this.router.get('/', (req, res) => {
			res.redirect('https://discordapp.com/oauth2/authorize?client_id=' + config.website.discord.clientID + '&scope=bot&permissions=8');
		});

		this.router.get('/:id', (req, res) => {
			res.redirect('https://discordapp.com/oauth2/authorize?client_id=' + config.website.discord.clientID + '&scope=bot&permissions=8&guild_id=' + req.params.id);
		});
	}

	getRouter() {
		return this.router;
	}
}

module.exports = Invite;