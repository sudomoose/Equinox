const humanizeDuration = require('humanize-duration');
const BaseCommand = require('../Structure/BaseCommand');
const updateBalance = require('../Util/updateBalance');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Daily extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'daily',
			aliases: [],
			description: 'Collect your daily cash reward.',
			category: 'Economy',
			usage: 'daily',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg) {
		this.r.table('intervals').get(msg.author.id).run((error, result) => {
			if (error) return handleDatabaseError(error, msg);
			if (result) {
				if (Date.now() - result.daily <= (1000 * 60 * 60 * 24)) return msg.channel.createMessage(':exclamation:   **»**   You\'ve already done your daily today. Try again in ' + humanizeDuration((1000 * 60 * 60 * 24) - (Date.now() - result.daily), { round: true }) + '.');
				this.r.table('intervals').get(msg.author.id).update({
					daily: Date.now()
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					updateBalance(this.r, msg.author.id, 250).then((balance) => {
						msg.channel.createMessage(':money_with_wings:   **»**   $250 has been added to your account. Your balance is now $' + balance + '.');
					}).catch((error) => {
						handleDatabaseError(error, msg);
					});
				});
			} else {
				this.r.table('intervals').insert({
					id: msg.author.id,
					daily: Date.now()
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					updateBalance(this.r, msg.author.id, 250).then((balance) => {
						msg.channel.createMessage(':money_with_wings:   **»**   $250 has been added to your account. Your balance is now $' + balance + '.');
					}).catch((error) => {
						handleDatabaseError(error, msg);
					});
				});
			}
		});
	}
}

module.exports = Daily;