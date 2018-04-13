const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Balance extends BaseCommand {
	constructor(bot, r) {
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
	}

	execute(msg, args) {
		resolveUser(this.bot, args.length > 0 ? args.join(' ') : msg.author.id).then((user) => {
			this.r.table('balance').get(user.id).run((error, balance) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage(':money_with_wings:   **»**   ' + (user.id === msg.author.id ? 'You have' : user.username + '#' + user.discriminator + ' has') + ' a total of $' + (balance ? balance.amount : 0) + '.');
			});
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any users by that query.');
		});
	}
}

module.exports = Balance;