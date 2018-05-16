const express = require('express');
const humanizeDuration = require('humanize-duration');

class Statistics {
	constructor(bot, r, metrics) {
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.route = '/statistics';
		this.router = express.Router();
		this.setupRoutes();
	}

	setupRoutes() {
		this.router.get('/', (req, res) => {
			const mostUsedCommand = Object.keys(this.bot.statistics.commandUsage).sort((a, b) => {
				if (this.bot.statistics.commandUsage[a] < this.bot.statistics.commandUsage[b]) return 1;
				if (this.bot.statistics.commandUsage[a] > this.bot.statistics.commandUsage[b]) return -1;
				return 0;
			})[0];
			res.render('statistics.pug', {
				shards: this.bot.shards.size,
				guilds: this.bot.guilds.size,
				users: this.bot.users.size,
				voiceConnections: this.bot.voiceConnections.size,
				queueSize: Object.values(this.bot.queue).reduce((a, b) => a + b.queue.length, 0),
				queueLength: humanizeDuration(Object.values(this.bot.queue).reduce((a, b) => a + b.queue.reduce((a, b) => a + b.info.length, 0), 0), { round: true }),
				mostUsedCommand: {
					command: mostUsedCommand || 'N/A',
					usage: this.bot.statistics.commandUsage[mostUsedCommand] || 0
				},
				eventsReceived: this.bot.statistics.eventsReceived,
				messagesReceived: this.bot.statistics.messagesReceived
			});
		});
	}

	getRouter() {
		return this.router;
	}
}

module.exports = Statistics;