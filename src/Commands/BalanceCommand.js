const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Balance extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'balance',
			aliases: [
				'bal',
				'money'
			],
			description: 'View how many coins you own.',
			category: 'Economy',
			usage: 'balance [<user...>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		resolveUser(this.bot, args.length > 0 ? args.join(' ') : msg.author.id).then((user) => {
			this.r.table('balance').get(user.id).run((error, balance) => {
				if (error) return handleDatabaseError(error, msg);
				if (user.id === msg.author.id) {
					msg.channel.createMessage(this.i18n.__({ phrase: 'balance.balanceSelf', locale: msg.locale }, balance ? balance.amount.toLocaleString() : 0));
				} else {
					msg.channel.createMessage(this.i18n.__({ phrase: 'balance.balance', locale: msg.locale }, balance ? balance.amount.toLocaleString() : 0));
				}
			});
		}).catch(() => {
			msg.channel.createMessage(this.i18n.__({ phrase: 'balance.noUsers', locale: msg.locale }));
		});
	}
}

module.exports = Balance;