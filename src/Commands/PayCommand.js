const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Pay extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'pay',
			aliases: [],
			description: 'Pays another user money.',
			category: 'Economy',
			usage: 'pay <user> <amount>',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a user ID, user mention, or user name.');
		if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide an amount to transfer.');
		if (isNaN(args[1])) return msg.channel.createMessage(':exclamation:   **»**   The transfer amount must be a valid number.');
		if (Number(args[1]) < 1) return msg.channel.createMessage(':exclamation:   **»**   The transfer amount must be greater than or equal to 1.');
		resolveUser(this.bot, args[0]).then((user) => {
			this.r.table('balance').get(msg.author.id).run((error, balance) => {
				if (error) return handleDatabaseError(error, msg);
				if (!balance || Number(args[1]) > balance.amount) return msg.channel.createMessage(':exclamation:   **»**   You cannot transfer more money than you have.');
				this.r.table('balance').get(msg.author.id).update({
					amount: balance.amount - Number(args[1])
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					this.r.table('balance').get(user.id).run((error, balance) => {
						if (error) return handleDatabaseError(error, msg);
						if (balance) {
							this.r.table('balance').get(user.id).update({
								amount: balance.amount + Number(args[1])
							}).run((error) => {
								if (error) return handleDatabaseError(error, msg);
								msg.channel.createMessage(':money_with_wings:   **»**   Successfully sent $' + Number(args[1]).toLocaleString() + ' to `' + user.username + '#' + user.discriminator + '`.');
							});
						} else {
							this.r.table('balance').insert({
								id: user.id,
								amount: Number(args[1])
							}).run((error) => {
								if (error) return handleDatabaseError(error, msg);
								msg.channel.createMessage(':money_with_wings:   **»**   Successfully sent $' + Number(args[1]).toLocaleString() + ' to `' + user.username + '#' + user.discriminator + '`.');
							});
						}
					});
				});
			});
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any users by that query.');
		});
	}
}

module.exports = Pay;