const express = require('express');

class Server {
	constructor(bot, r, metrics) {
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.route = '/';
		this.router = express.Router();
		this.setupRoutes();
	}

	setupRoutes() {
		this.router.get('/', (req, res) => {
			res.render('index.pug');
		});
	}

	getRouter() {
		return this.router;
	}
}

module.exports = Server;