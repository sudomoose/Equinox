const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const formatPhoneNumber = require('../Util/formatPhoneNumber');

class Register extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'register',
			aliases: [
				'reg'
			],
			description: 'Register for a phone number for this channel.',
			category: 'Fun',
			usage: 'register',
			hidden: false,
			guildOnly: true
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg) {
		this.r.table('registrations').get(msg.channel.id).run((error, register) => {
			if (error) return handleDatabaseError(error, msg);
			if (register) return msg.channel.createMessage(':exclamation:   **»**   There is already a number registered for this channel, it is `' + formatPhoneNumber(register.number) + '`.');
			const number = Math.floor(Math.random() * (9999999999 - 1000000000)) + 1000000000;
			this.r.table('registrations').insert({
				id: msg.channel.id,
				number
			}).run((error) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage(':white_check_mark:   **»**   The new phone number for this channel is now `' + formatPhoneNumber(number) + '`.');
			});
		});
	}
}

module.exports = Register;