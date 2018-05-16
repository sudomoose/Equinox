const express = require('express');

class Commands {
	constructor(bot, r, metrics) {
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.route = '/commands';
		this.router = express.Router();
		this.setupRoutes();
	}

	setupRoutes() {
		this.router.get('/', (req, res) => {
			const categories = [];
			this.bot.commands.filter((command) => !command.hidden).forEach((command) => {
				if (!categories.includes(command.category)) categories.push(command.category);
			});
			res.render('commands.pug', {
				categories: categories.sort((a, b) => {
					if (a > b) return 1;
					if (b > a) return -1;
					return 0;
				}),
				commands: Array.from(this.bot.commands.values()).filter((command) => !command.hidden)
			});
		});
	}

	getRouter() {
		return this.router;
	}
}

module.exports = Commands;