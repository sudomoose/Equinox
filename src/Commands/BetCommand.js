const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Bet extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'bet',
			aliases: [],
			description: 'Bet cash to double it or lose it.',
			category: 'Economy',
			usage: 'bet [<amount...>]',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(this.i18n.__({ phrase: 'bet.betRequired', locale: msg.locale }));
		if (isNaN(args[0])) return msg.channel.createMessage(this.i18n.__({ phrase: 'bet.betInvalid', locale: msg.locale }));
		if (Number(args[0]) < 1) return msg.channel.createMessage(this.i18n.__({ phrase: 'bet.betGTR', locale: msg.locale }));
		this.r.table('balance').get(msg.author.id).run((error, balance) => {
			if (error) return handleDatabaseError(error, msg);
			if (!balance || balance.amount < Number(args[0])) return msg.channel.createMessage(this.i18n.__({ phrase: 'bet.notEnough', locale: msg.locale }));
			if (Math.round(Math.random()) >= 0.5) {
				this.r.table('balance').get(msg.author.id).update({
					amount: balance.amount + Number(args[0])
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					msg.channel.createMessage(this.i18n.__({ phrase: 'bet.guessCorrect', locale: msg.locale }, Number(args[0]).toLocaleString(), (balance.amount + Number(args[0])).toLocaleString()));
				});
			} else {
				this.r.table('balance').get(msg.author.id).update({
					amount: balance.amount - Number(args[0])
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					msg.channel.createMessage(this.i18n.__({ phrase: 'bet.guessIncorrect', locale: msg.locale }, Number(args[0]).toLocaleString(), (balance.amount - Number(args[0])).toLocaleString()));
				});
			}
		});
	}
}

module.exports = Bet;