const handleDatabaseError = require('../Util/handleDatabaseError');
const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');
const DescriptionBuilder = require('../Structure/DescriptionBuilder');

class UserStatistics extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'user-stats',
			aliases: [
				'userstats',
				'user-statistics',
				'userstatistics'
			],
			description: 'Displays statistics about a user.',
			category: 'Information',
			usage: 'user-stats [<user...>]',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg, args) {
		resolveUser(this.bot, args.length > 0 ? args.join(' ') : msg.author.id).then((user) => {
			this.r.table('user_statistics').get(user.id).run((error, stats) => {
				if (error) return handleDatabaseError(error, msg);
				msg.channel.createMessage({
					embed: {
						title: 'User Statistics',
						color: this.bot.embedColor,
						thumbnail: {
							url: user.avatarURL || user.defaultAvatarURL
						},
						description: new DescriptionBuilder().addField('Name', user.username + '#' + user.discriminator).addField('ID', user.id).addField('Bot', user.bot ? 'Yes' : 'No').addField('Messages Sent', ((stats ? stats.messagesSent : 0) + (user.id in this.bot.queuedQueries.userStatistics ? this.bot.queuedQueries.userStatistics[user.id].messagesSent : 0)).toLocaleString()).addField('Word Count', ((stats ? stats.wordCount : 0) + (user.id in this.bot.queuedQueries.userStatistics ? this.bot.queuedQueries.userStatistics[user.id].wordCount : 0)).toLocaleString()).addField('Character Count', ((stats ? stats.characterCount : 0) + (user.id in this.bot.queuedQueries.userStatistics ? this.bot.queuedQueries.userStatistics[user.id].characterCount : 0)).toLocaleString()).build()
					}
				});
			});
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any users by that query.');
		});
	}
}

module.exports = UserStatistics;