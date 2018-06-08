const BaseCommand = require('../Structure/BaseCommand');

class Selling extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'selling',
			aliases: [],
			description: 'View some of the products Mayo is selling.',
			category: 'Special',
			usage: 'selling',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg) {
		msg.channel.createMessage('Hello, it\'s me, PassTheMayo. I am the creator of Equinox, and I attempting to sell some of my electronics but no one is interested, so maybe you might be `:^)`.\n\nI am attempting to sell a 2015 MacBook Pro 13" with 256 GB of storage and an HP Pavilion 23" All-in-One PC. If you are interested in anything listed, please instantly add `PassTheMayo#1281` as a friend and DM him. He will be highly appreciative of anyone interested! Thank you.');
	}
}

module.exports = Selling;