const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Leaderboard extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'leaderboard',
			aliases: [
				'lb',
				'top'
			],
			description: 'View the top most people with coins.',
			category: 'Information',
			usage: 'leaderboard [server]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (args.length > 0) {
			if (args[0].toLowerCase() === 'server') {
				if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
				this.r.table('balance').orderBy(this.r.desc('amount')).run((error, leaderboard) => {
					if (error) return handleDatabaseError(error, msg);
					leaderboard = leaderboard.filter((balance) => msg.channel.guild.members.has(balance.id));
					if (leaderboard.length < 1) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any users that have a balance in this server.');
					const longestName = Math.max(...leaderboard.map((balance) => (this.bot.users.has(balance.id) ? this.bot.users.get(balance.id).username + '#' + this.bot.users.get(balance.id).discriminator : 'Unknown').length));
					msg.channel.createMessage('```\n' + leaderboard.map((balance, i) => (i + 1) + '.' + Array(6 - ((i + 1) + '.').length).join(' ') + (this.bot.users.has(balance.id) ? this.bot.users.get(balance.id).username + '#' + this.bot.users.get(balance.id).discriminator : 'Unknown') + Array((longestName + 3) - (this.bot.users.has(balance.id) ? this.bot.users.get(balance.id).username + '#' + this.bot.users.get(balance.id).discriminator : 'Unknown').length).join(' ') + '$' + balance.amount.toLocaleString()).join('\n') + '```');
				});
			} else {
				msg.channel.createMessage(':exclamation:   **»**   Unknown argument `' + args[0].toLowerCase() + '`. Please refer to the command usage for more information.');
			}
		} else {
			this.r.table('balance').orderBy(this.r.desc('amount')).limit(20).run((error, leaderboard) => {
				if (error) return handleDatabaseError(error, msg);
				const longestName = Math.max(...leaderboard.map((balance) => (this.bot.users.has(balance.id) ? this.bot.users.get(balance.id).username + '#' + this.bot.users.get(balance.id).discriminator : 'Unknown').length));
				msg.channel.createMessage('```\n' + leaderboard.map((balance, i) => (i + 1) + '.' + Array(6 - ((i + 1) + '.').length).join(' ') + (this.bot.users.has(balance.id) ? this.bot.users.get(balance.id).username + '#' + this.bot.users.get(balance.id).discriminator : 'Unknown') + Array((longestName + 3) - (this.bot.users.has(balance.id) ? this.bot.users.get(balance.id).username + '#' + this.bot.users.get(balance.id).discriminator : 'Unknown').length).join(' ') + '$' + balance.amount.toLocaleString()).join('\n') + '```');
			});
		}
	}
}

module.exports = Leaderboard;