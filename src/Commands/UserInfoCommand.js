const dateformat = require('dateformat');
const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');

class UserInfo extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'userinfo',
			aliases: [
				'user'
			],
			description: 'Displays information about a user.',
			category: 'Information',
			usage: 'userinfo [<user...>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		resolveUser(this.bot, args.length > 0 ? args.join(' ') : msg.author.id).then((user) => {
			const embed = {
				title: 'User Information',
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
						name: 'Created At',
						value: dateformat(user.createdAt, 'mm/dd/yyyy hh:MM:ss TT'),
						inline: true
					},
					{
						name: 'Bot',
						value: user.bot ? 'Yes' : 'No',
						inline: true
					}
				]
			};
			if (msg.channel.guild && msg.channel.guild.members.has(user.id)) {
				const member = msg.channel.guild.members.get(user.id);
				if (member.nick) embed.fields.push({
					name: 'Nickname',
					value: member.nick,
					inline: true
				});
				embed.fields.push({
					name: 'Status',
					value: member.status === 'online' ? 'Online' : member.status === 'idle' ? 'Away' : member.status === 'dnd' ? 'Do Not Disturb' : 'Offline',
					inline: true
				});
				embed.fields.push({
					name: 'Roles',
					value: member.roles.length,
					inline: true
				});
				if (member.game) {
					embed.description = (member.game.type === 0 ? 'Playing' : member.game.type === 1 ? 'Streaming' : member.game.type === 2 ? 'Listening to' : member.game.type === 3 ? 'Watching' : '') + ' **' + member.game.name + '**';
				}
				embed.fields.push({
					name: 'Joined At',
					value: dateformat(member.joinedAt, 'mm/dd/yyyy hh:MM:ss TT'),
					inline: true
				});
				if (member.voiceState.channelID && msg.channel.guild.channels.has(member.voiceState.channelID)) {
					const voiceChannel = msg.channel.guild.channels.get(member.voiceState.channelID);
					embed.fields.push({
						name: 'Voice Channel',
						value: voiceChannel.name,
						inline: true
					});
					embed.fields.push({
						name: 'Mute',
						value: member.voiceState.mute || member.voiceState.self_mute ? 'Yes' : 'No',
						inline: true
					});
					embed.fields.push({
						name: 'Deaf',
						value: member.voiceState.deaf || member.voiceState.self_deaf ? 'Yes' : 'No',
						inline: true
					});
				}
			}
			msg.channel.createMessage({ embed });
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any users by that query.');
		});
	}
}

module.exports = UserInfo;