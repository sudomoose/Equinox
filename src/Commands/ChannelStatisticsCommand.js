const handleDatabaseError = require('../Util/handleDatabaseError');
const BaseCommand = require('../Structure/BaseCommand');
const resolveChannel = require('../Util/resolveChannel');

class ChannelStatistics extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'channel-stats',
			aliases: [
				'channelstats',
				'channel-statistics',
				'channelstatistics'
			],
			description: 'Displays statistics about a channel.',
			category: 'Information',
			usage: 'channel-stats [<channel...>]',
			hidden: false,
			guildOnly: true
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		resolveChannel(this.bot, args.length > 0 ? args.join(' ') : msg.channel.id, msg.channel.guild).then((channel) => {
			this.r.table('channel_statistics').get(channel.id).run((error, stats) => {
				if (error) return handleDatabaseError(error, msg);
				if (channel.type === 0) {
					msg.channel.createMessage({
						embed: {
							title: 'Channel Statistics',
							color: this.bot.embedColor,
							fields: [
								{
									name: 'Name',
									value: '#' + channel.name,
									inline: true
								},
								{
									name: 'ID',
									value: channel.id,
									inline: true
								},
								{
									name: 'Type',
									value: 'Text Channel',
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
				} else if (channel.type === 2) {
					msg.channel.createMessage(':exclamation:   **»**   You cannot get statistics on a voice channel.');
				} else if (channel.type === 4) {
					msg.channel.createMessage(':exclamation:   **»**   You cannot get statistics on a category.');
				}
			});
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any channels by that query.');
		});
	}
}

module.exports = ChannelStatistics;