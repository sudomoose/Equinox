const handleDatabaseError = require('../Util/handleDatabaseError');
const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');

class UserInfo extends BaseCommand {
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
						fields: [
							{
								name: 'Name',
								value: user.username + '#' + user.discriminator,
								inline: true
							},
							{
								name: 'ID',
								value: user.id,
								inline: true
							},
							{
								name: 'Bot',
								value: user.bot ? 'Yes' : 'No',
								inline: true
							},
							{
								name: 'Messages Sent',
								value: stats ? stats.messagesSent.toLocaleString() : 0,
								inline: true
							},
							{
								name: 'Word Count',
								value: stats ? stats.wordCount.toLocaleString() : 0,
								inline: true
							},
							{
								name: 'Character Count',
								value: stats ? stats.characterCount.toLocaleString() : 0,
								inline: true
							}
						]
					}
				});
			});
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any users by that query.');
		});
	}
}

module.exports = UserInfo;