const express = require('express');

class Tags {
	constructor(bot, r, metrics) {
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.route = '/tags';
		this.router = express.Router();
		this.setupRoutes();
	}

	setupRoutes() {
		this.router.get('/', (req, res) => {
			res.render('tags.pug');
		});
	}

	getRouter() {
		return this.router;
	}
}

module.exports = Tags;