const Eris = require('eris');
const fs = require('fs');
const path = require('path');
const rethink = require('rethinkdbdash');
const Collection = require('./Structure/Collection');
const config = require('./config.json');

class Client {
	constructor(...args) {
		this.bot = new Eris(...args);
	}

	launch() {
		this.r = rethink(config.rethinkdb);

		this.bot.embedColor = 15277667;
		this.bot.commands = new Collection();
		this.bot.prefixes = new Collection();
		this.bot.reminders = new Collection();
		this.bot.queue = {};

		this.loadCommand(path.join(__dirname, 'Commands'));
		this.loadEvents(path.join(__dirname, 'Events'));

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
				const command = new Command(this.bot, this.r);
				this.bot.commands.set(command.command, command);
			}
		});
	}

	loadEvents(dir) {
		fs.readdir(dir, (error, events) => {
			if (error) throw error;
			for (let i = 0; i < events.length; i++) {
				const event = require(path.join(__dirname, 'Events', events[i]));
				event(this.bot, this.r);
			}
		});
	}
}

module.exports = Client;