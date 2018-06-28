const humanizeDuration = require('humanize-duration');
const BaseCommand = require('../Structure/BaseCommand');
const updateBalance = require('../Util/updateBalance');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Monthly extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'monthly',
			aliases: [],
			description: 'Collect your monthly cash reward.',
			category: 'Economy',
			usage: 'monthly',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg) {
		this.r.table('intervals').get(msg.author.id).run((error, result) => {
			if (error) return handleDatabaseError(error, msg);
			const amount = Math.floor(Math.random() * ((500 - 100) * 30)) + Math.ceil(100 * 30);
			if (result) {
				if (Date.now() - result.monthly <= (1000 * 60 * 60 * 24 * 30)) return msg.channel.createMessage(':exclamation:   **»**   You\'ve already done your monthly in the last month. Try again in ' + humanizeDuration((1000 * 60 * 60 * 24 * 30) - (Date.now() - result.monthly), { round: true }) + '.');
				this.r.table('intervals').get(msg.author.id).update({
					monthly: Date.now()
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					updateBalance(this.r, msg.author.id, amount).then((balance) => {
						msg.channel.createMessage(':money_with_wings:   **»**   $' + amount.toLocaleString() + ' has been added to your account. Your balance is now $' + balance.toLocaleString() + '.');
					}).catch((error) => {
						handleDatabaseError(error, msg);
					});
				});
			} else {
				this.r.table('intervals').insert({
					id: msg.author.id,
					monthly: Date.now()
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					updateBalance(this.r, msg.author.id, amount).then((balance) => {
						msg.channel.createMessage(':money_with_wings:   **»**   $' + amount.toLocaleString() + ' has been added to your account. Your balance is now $' + balance.toLocaleString() + '.');
					}).catch((error) => {
						handleDatabaseError(error, msg);
					});
				});
			}
		});
	}
}

module.exports = Monthly;