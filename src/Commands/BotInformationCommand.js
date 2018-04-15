const snekfetch = require('snekfetch');
const dateformat = require('dateformat');
const BaseCommand = require('../Structure/BaseCommand');
const resolveUser = require('../Util/resolveUser');
const Logger = require('../Util/Logger');
const config = require('../config.json');

class ChannelInfo extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'botinfo',
			aliases: [
				'bot'
			],
			description: 'Retrieves information about a bot on the bot lists.',
			category: 'Utility',
			usage: 'botinfo <bot>',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a bot ID, bot mention, or bot username.');
		resolveUser(this.bot, args.join(' ')).then((user) => {
			const embed = {
				title: user.username + '#' + user.discriminator,
				color: this.bot.embedColor,
				thumbnail: {
					url: user.avatarURL || user.defaultAvatarURL
				},
				fields: [
					{
						name: 'ID',
						value: user.id,
						inline: true
					},
					{
						name: 'Created At',
						value: dateformat(user.createdAt, 'mm/dd/yyyy hh:MM:ss TT'),
						inline: true
					}
				]
			};
			const checkDBL = () => {
				snekfetch.get('https://discordbots.org/api/bots/' + user.id + '/').then((result) => {
					if (!embed.description) embed.description = result.shortdesc;
					if (embed.fields.filter((field) => field.name === 'Library').length < 1) embed.fields.push({
						name: 'Library',
						value: result.body.lib,
						inline: true
					});
					if (embed.fields.filter((field) => field.name === 'Prefix').length < 1) embed.fields.push({
						name: 'Prefix',
						value: result.body.prefix,
						inline: true
					});
					if (embed.fields.filter((field) => field.name === 'Owners').length < 1) embed.fields.push({
						name: 'Owners',
						value: result.body.owners.map((owner) => '<@' + owner + '>').join(', '),
						inline: true
					});
					if (result.body.website && embed.fields.filter((field) => field.name === 'Website').length < 1) embed.fields.push({
						name: 'Website',
						value: result.body.website,
						inline: true
					});
					checkDB();
				}).catch((error) => {
					if (error.status === 404) return checkDB();
					msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
					Logger.error('Failed to get bot info', error);
				});
			};
			const checkDB = () => {
				snekfetch.get('https://bots.discord.pw/api/bots/' + user.id + '/').set('Authorization', config.api_keys['bots.discord.pw']).then((result) => {
					embed.description = result.body.description;
					if (result.body.website && embed.fields.filter((field) => field.name === 'Website').length < 1) embed.fields.push({
						name: 'Website',
						value: result.body.website,
						inline: true
					});
					if (embed.fields.filter((field) => field.name === 'Library').length < 1) embed.fields.push({
						name: 'Library',
						value: result.body.library,
						inline: true
					});
					if (embed.fields.filter((field) => field.name === 'Prefix').length < 1) embed.fields.push({
						name: 'Prefix',
						value: result.body.prefix,
						inline: true
					});
					if (embed.fields.filter((field) => field.name === 'Owners').length < 1) embed.fields.push({
						name: 'Owners',
						value: result.body.owners.map((owner) => '<@' + owner + '>').join(', '),
						inline: true
					});
					checkTerminal();
				}).catch((error) => {
					if (error.status === 404) return checkTerminal();
					msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
					Logger.error('Failed to get bot info', error);
				});
			};
			const checkTerminal = () => {
				snekfetch.get('https://ls.terminal.ink/api/v1/bots/' + user.id + '/').then((result) => {
					if (!embed.description) embed.description = result.body.shortDesc;
					if (result.body.website && embed.fields.filter((field) => field.name === 'Website').length < 1) embed.fields.push({
						name: 'Website',
						value: result.body.website,
						inline: true
					});
					if (embed.fields.filter((field) => field.name === 'Prefix').length < 1) embed.fields.push({
						name: 'Prefix',
						value: result.body.prefix,
						inline: true
					});
					if (embed.fields.filter((field) => field.name === 'Owners').length < 1) embed.fields.push({
						name: 'Owners',
						value: '<@' + result.body.owner + '>',
						inline: true
					});
					checkBL();
				}).catch((error) => {
					if (error.status === 404) return checkBL();
					msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
					Logger.error('Failed to get bot info', error);
				});
			};
			const checkBL = () => {
				snekfetch.get('https://botlist.space/api/bots/' + user.id + '/').then((result) => {
					if (!embed.description) embed.description = result.body.shortDesc;
					if (result.body.library && embed.fields.filter((field) => field.name === 'Library').length < 1) embed.fields.push({
						name: 'Library',
						value: result.body.library,
						inline: true
					});
					if (embed.fields.filter((field) => field.name === 'Prefix').length < 1) embed.fields.push({
						name: 'Prefix',
						value: result.body.prefix,
						inline: true
					});
					if (embed.fields.filter((field) => field.name === 'Owners').length < 1) embed.fields.push({
						name: 'Owners',
						value: result.body.owners.map((owner) => '<@' + owner.id + '>').join(', '),
						inline: true
					});
					msg.channel.createMessage({ embed });
				}).catch((error) => {
					if (error.status === 404) msg.channel.createMessage({ embed });
					msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
					Logger.error('Failed to get bot info', error);
				});
			};
			checkDBL();
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any users by that query.');
		});
	}
}

module.exports = ChannelInfo;