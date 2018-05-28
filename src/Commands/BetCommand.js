const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Bet extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'bet',
			aliases: [],
			description: 'Bet cash to double it or lose it.',
			category: 'Economy',
			usage: 'bet [<amount...>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide an amount to bet.');
		if (isNaN(args[0])) return msg.channel.createMessage(':exclamation:   **»**   The bet amount must be a valid number.');
		if (Number(args[0]) < 1) return msg.channel.createMessage(':exclamation:   **»**   The bet amount must be greater than or equal to 1.');
		this.r.table('balance').get(msg.author.id).run((error, balance) => {
			if (error) return handleDatabaseError(error, msg);
			if (!balance || balance.amount < Number(args[0])) return msg.channel.createMessage(':exclamation:   **»**   You cannot bet more money than you have.');
			if (Math.round(Math.random()) >= 0.5) {
				this.r.table('balance').get(msg.author.id).update({
					amount: balance.amount + Number(args[0])
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					msg.channel.createMessage(':money_with_wings:   **»**   You guessed the correct number and added $' + Number(args[0]).toLocaleString() + ' to your account. Your new balance is $' + (balance.amount + Number(args[0])).toLocaleString() + '.');
				});
			} else {
				this.r.table('balance').get(msg.author.id).update({
					amount: balance.amount - Number(args[0])
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					msg.channel.createMessage(':money_with_wings:   **»**   You guessed the wrong number and $' + Number(args[0]).toLocaleString() + ' was removed from your account. Your new balance is $' + (balance.amount - Number(args[0])).toLocaleString() + '.');
				});
			}
		});
	}
}

module.exports = Bet;