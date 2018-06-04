const Eris = require('eris');
const fs = require('fs');
const path = require('path');
const Collection = require('./Structure/Collection');
const config = require('./config.json');
const Logger = require('./Util/Logger');

class Client {
	constructor(options) {
		this.bot = new Eris(options.token, options.client_options);
		this.r = options.rethinkdb;
		this.metrics = options.metrics;
	}

	launch() {
		this.metrics.init({
			prefix: 'equinox.',
			apiKey: config.api_keys.datadog.apiKey,
			appKey: config.api_keys.datadog.appKey,
			flushIntervalSeconds: 60
		});

		this.bot.embedColor = 3066993; // 15277667
		this.bot.commands = new Collection();
		this.bot.prefixes = new Collection();
		this.bot.reminders = new Collection();
		this.bot.pardonModLog = new Collection();
		this.bot.calls = new Collection();
		this.bot.queue = {};
		this.bot.statistics = {
			commandUsage: {},
			eventsReceived: 0,
			messagesReceived: 0
		};

		this.loadCommand(path.join(__dirname, 'Commands'));
		this.loadEvents(path.join(__dirname, 'Events'));
		this.setupMetrics();

		process.on('unhandledRejection', (error) => {
			if (error.code && (error.code === 50006 || error.code === 50007 || error.code === 50013)) return;
			Logger.error(error);
		});

		process.on('exit', () => {
			this.bot.disconnect({
				reconnect: false
			});
		});

		this.bot.connect();
	}

	loadCommand(dir) {
		fs.readdir(dir, (error, commands) => {
			if (error) throw error;
			for (let i = 0; i < commands.length; i++) {
				const Command = require(path.join(__dirname, 'Commands', commands[i]));
				const command = new Command(this.bot, this.r, this.metrics);
				this.bot.commands.set(command.command, command);
			}
		});
	}

	loadEvents(dir) {
		fs.readdir(dir, (error, events) => {
			if (error) throw error;
			for (let i = 0; i < events.length; i++) {
				const event = require(path.join(__dirname, 'Events', events[i]));
				event(this.bot, this.r, this.metrics);
			}
		});
	}

	setupMetrics() {
		setInterval(() => {
			this.metrics.gauge('guilds', this.bot.guilds.size);
			this.metrics.gauge('memoryUsage', process.memoryUsage().heapUsed);
			this.metrics.gauge('uptime', Date.now() - this.bot.startTime);
			this.metrics.gauge('voiceConnections', this.bot.voiceConnections.size);
			this.r.db('rethinkdb').table('stats').get([ 'cluster' ]).run((error, cluster) => {
				if (error) return Logger.error(error);
				this.metrics.gauge('database.queriesPerSecond', cluster[0].query_engine.queries_per_sec);
				this.metrics.gauge('database.connections', cluster[0].query_engine.client_connections);
			});
		}, 1000 * 60);
	}
}

module.exports = Client;
