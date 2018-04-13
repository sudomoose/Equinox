const dateformat = require('dateformat');
const BaseCommand = require('../Structure/BaseCommand');
const resolveRole = require('../Util/resolveRole');

class RoleInfo extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'roleinfo',
			aliases: [
				'role'
			],
			description: 'Displays information about a role.',
			category: 'Discord',
			usage: 'roleinfo [<role...>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (args.length < 1 && !msg.channel.guild) return msg.channel.createMessage(':question:   **»**   You must provide a role name, role mention, or role ID.');
		resolveRole(this.bot, args.length > 0 ? args.join(' ') : msg.member.roles[msg.member.roles.length - 1]).then((role) => {
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