const handleDatabaseError = require('../Util/handleDatabaseError');
const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');
const DescriptionBuilder = require('../Structure/DescriptionBuilder');

class UserStatistics extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
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
						description: new DescriptionBuilder().addField('Name', user.username + '#' + user.discriminator).addField('ID', user.id).addField('Bot', user.bot ? 'Yes' : 'No').addField('Messages Sent', stats ? stats.messagesSent.toLocaleString() : 0).addField('Word Count', stats ? stats.wordCount.toLocaleString() : 0).addField('Character Count', stats ? stats.characterCount.toLocaleString() : 0).build()
					}
				});
			});
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any users by that query.');
		});
	}
}

module.exports = UserStatistics;