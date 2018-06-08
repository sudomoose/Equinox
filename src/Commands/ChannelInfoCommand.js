const BaseCommand = require('../Structure/BaseCommand');
const dateformat = require('dateformat');
const resolveChannel = require('../Util/resolveChannel');

class ChannelInfo extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'channelinfo',
			aliases: [
				'channel'
			],
			description: 'Displays information about a channel.',
			category: 'Information',
			usage: 'channelinfo [<channel...>]',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (!msg.channel.guild && args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a server ID, or server name.');
		resolveChannel(this.bot, args.length > 0 ? args.join(' ') : msg.channel.id, msg.channel.guild).then((channel) => {
			const embed = {
				title: 'Channel Information',
				color: this.bot.embedColor,
				fields: [
					{
						name: 'Name',
						value: (channel.type === 0 ? '#' : '') + channel.name,
						inline: true
					},
					{
						name: 'ID',
						value: channel.id,
						inline: true
					},
					{
						name: 'Created At',
						value: dateformat(channel.createdAt, 'mm/dd/yyyy hh:MM:ss TT'),
						inline: true
					},
					{
						name: 'Type',
						value: channel.type === 0 ? 'Text' : channel.type === 2 ? 'Voice' : channel.type === 4 ? 'Category' : 'Unknown',
						inline: true
					}
				]
			};
			if (channel.type === 0) {
				embed.fields.push({
					name: 'NSFW',
					value: channel.nsfw ? 'Yes' : 'No',
					inline: true
				});
			}
			if (!msg.channel.guild || !msg.channel.guild.channels.has(channel.id)) {
				const guild = this.bot.guilds.get(this.bot.channelGuildMap[channel.id]);
				embed.fields.push({
					name: 'Server',
					value: guild.name,
					inline: true
				});
			}
			if (channel.type !== 4 && channel.parentID) {
				embed.fields.push({
					name: 'Category',
					value: channel.guild.channels.get(channel.parentID).name,
					inline: true
				});
			}
			if (channel.type === 2) {
				embed.fields.push({
					name: 'Users Connected',
					value: channel.voiceMembers.size,
					inline: true
				});
				embed.fields.push({
					name: 'User Limit',
					value: channel.userLimit,
					inline: true
				});
			}
			msg.channel.createMessage({ embed });
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any channels by that query.');
		});
	}
}

module.exports = ChannelInfo;