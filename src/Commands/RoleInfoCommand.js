const dateformat = require('dateformat');
const BaseCommand = require('../Structure/BaseCommand');
const resolveRole = require('../Util/resolveRole');

class RoleInfo extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'role-info',
			aliases: [
				'roleinfo',
				'role-information',
				'roleinformation',
				'role'
			],
			description: 'Displays information about a role.',
			category: 'Information',
			usage: 'roleinfo [<role...>]',
			hidden: false,
			guildOnly: true
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg, args) {
		resolveRole(this.bot, args.length > 0 ? args.join(' ') : msg.member.roles[msg.member.roles.length - 1], msg.channel.guild).then((role) => {
			const embed = {
				title: 'Role Information',
				color: role.color,
				fields: [
					{
						name: 'Name',
						value: role.name,
						inline: true
					},
					{
						name: 'ID',
						value: role.id,
						inline: true
					},
					{
						name: 'Created At',
						value: dateformat(role.createdAt, 'mm/dd/yyyy hh:MM:ss TT'),
						inline: true
					},
					{
						name: 'Position',
						value: role.position - 1,
						inline: true
					},
					{
						name: 'Hoisted',
						value: role.hoist ? 'Yes' : 'No',
						inline: true
					},
					{
						name: 'Managed',
						value: role.managed ? 'Yes' : 'No',
						inline: true
					},
					{
						name: 'Mentionable',
						value: role.mentionable ? 'Yes' : 'No',
						inline: true
					}
				]
			};
			msg.channel.createMessage({ embed });
		}).catch(() => {
			msg.channel.createMessage(':exclamation:   **»**   Unable to find any roles by that query.');
		});
	}
}

module.exports = RoleInfo;