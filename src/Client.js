const Eris = require('eris');
const fs = require('fs');
const path = require('path');
const SQLite = require('sqlite3');
const Collection = require('./Structure/Collection');
const config = require('./config.json');
const Logger = require('./Util/Logger');
const handleDatabaseError = require('./Util/handleDatabaseError');

class Client {
	constructor(options) {
		this.bot = new Eris(options.token, options.client_options);
		this.r = options.rethinkdb;
		this.secondaryDB = new SQLite.Database('database.db');
		this.metrics = options.metrics;
		this.i18n = options.i18n;
	}

	launch() {
		this.metrics.init({
			prefix: 'equinox.',
			apiKey: config.api_keys.datadog.apiKey,
			appKey: config.api_keys.datadog.appKey,
			flushIntervalSeconds: 60
		});

		this.secondaryDB.run('CREATE TABLE IF NOT EXISTS uptime (userID TEXT NOT NULL, since INT NOT NULL, duration INT NOT NULL, status TEXT NOT NULL, timestamp INT NOT NULL);', (error) => {
			if (error) return handleDatabaseError(error);
		});

		this.bot.embedColor = 3066993; // 15277667
		this.bot.commands = new Collection();
		this.bot.prefixes = new Collection();
		this.bot.reminders = new Collection();
		this.bot.pardonModLog = new Collection();
		this.bot.calls = new Collection();
		this.bot.queue = new Collection();
		this.bot.locales = new Collection();
		this.bot.messageHandlers = [];
		this.bot.statistics = {
			commandUsage: {},
			eventsReceived: 0,
			messagesReceived: 0
		};
		this.bot.queuedQueries = {
			userStatistics: {},
			channelStatistics: {},
			serverStatistics: {}
		};
		this.bot.runQueuedQueries = this.runQueuedQueries.bind(this);

		this.loadCommand(path.join(__dirname, 'Commands'));
		this.loadEvents(path.join(__dirname, 'Events'));
		this.loadMessageHandlers(path.join(__dirname, 'MessageHandlers'));
		this.setupMetrics();
		this.runQueuedQueries();

		process.on('unhandledRejection', (error) => {
			if (error.code && (error.code === 50006 || error.code === 50007 || error.code === 50013)) return;
			Logger.error(error);
		});

		process.on('exit', () => {
			this.secondaryDB.close();
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
				const Command = require(path.join(dir, commands[i]));
				const command = new Command(this.bot, this.r, this.metrics, this.i18n, this.secondaryDB);
				command.file = path.join(dir, commands[i]);
				this.bot.commands.set(command.command, command);
			}
		});
	}

	loadEvents(dir) {
		fs.readdir(dir, (error, events) => {
			if (error) throw error;
			for (let i = 0; i < events.length; i++) {
				const event = require(path.join(dir, events[i]));
				event(this.bot, this.r, this.metrics, this.i18n, this.secondaryDB);
			}
		});
	}

	loadMessageHandlers(dir) {
		fs.readdir(dir, (error, events) => {
			if (error) throw error;
			for (let i = 0; i < events.length; i++) {
				const Handler = require(path.join(dir, events[i]));
				this.bot.messageHandlers.push(new Handler(this.bot, this.r, this.metrics, this.i18n, this.secondaryDB));
				if (i + 1 === events.length) {
					this.bot.messageHandlers = this.bot.messageHandlers.sort((a, b) => {
						if (a.position > b.position) return 1;
						if (b.position > a.position) return -1;
						return 0;
					});
				}
			}
		});
	}

	setupMetrics() {
		setInterval(() => {
			this.metrics.gauge('guilds', this.bot.guilds.size);
			this.metrics.gauge('memoryUsage', process.memoryUsage().heapUsed);
			this.metrics.gauge('uptime', Date.now() - this.bot.startTime);
			this.metrics.gauge('voiceConnections', this.bot.voiceConnections.size);
		}, 1000 * 60);
	}

	runQueuedQueries() {
		for (const userID in this.bot.queuedQueries.userStatistics) {
			const statistics = Object.create(this.bot.queuedQueries.userStatistics[userID]);
			delete this.bot.queuedQueries.userStatistics[userID];
			this.r.table('user_statistics').get(userID).update({
				characterCount: this.r.row('characterCount').add(statistics.characterCount),
				wordCount: this.r.row('wordCount').add(statistics.wordCount),
				messagesSent: this.r.row('messagesSent').add(statistics.messagesSent)
			}).run((error) => {
				if (error) return handleDatabaseError(error);
			});
		}

		for (const channelID in this.bot.queuedQueries.channelStatistics) {
			const statistics = Object.create(this.bot.queuedQueries.channelStatistics[channelID]);
			delete this.bot.queuedQueries.channelStatistics[channelID];
			this.r.table('channel_statistics').get(channelID).update({
				characterCount: this.r.row('characterCount').add(statistics.characterCount),
				wordCount: this.r.row('wordCount').add(statistics.wordCount),
				messagesSent: this.r.row('messagesSent').add(statistics.messagesSent)
			}).run((error) => {
				if (error) return handleDatabaseError(error);
			});
		}

		for (const guildID in this.bot.queuedQueries.serverStatistics) {
			const statistics = Object.create(this.bot.queuedQueries.serverStatistics[guildID]);
			delete this.bot.queuedQueries.serverStatistics[guildID];
			this.r.table('server_statistics').get(guildID).update({
				characterCount: this.r.row('characterCount').add(statistics.characterCount),
				wordCount: this.r.row('wordCount').add(statistics.wordCount),
				messagesSent: this.r.row('messagesSent').add(statistics.messagesSent)
			}).run((error) => {
				if (error) return handleDatabaseError(error);
			});
		}

		setTimeout(this.runQueuedQueries.bind(this), 1000 * 60 * 15);
	}
}

module.exports = Client;
