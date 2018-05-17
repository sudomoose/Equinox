const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Tag extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'tag',
			aliases: [
				'tags'
			],
			description: 'Creates or view a tag within this server.',
			category: 'Utility',
			usage: 'tag [create|delete|edit|list|<tag name>] [<name>] [<new value>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg, args) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide `create`, `delete`, `edit`, `list`, or a tag name.');
		if (args[0].toLowerCase() === 'create') {
			if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide a tag name.');
			if (args[1].toLowerCase() === 'create' || args[1].toLowerCase() === 'delete' || args[1].toLowerCase() === 'edit' || args[1].toLowerCase() === 'list') return msg.channel.createMessage(':exclamation:   **»**   That tag name is a reserved keyword for arguments in this command. Please choose a different name.');
			if (args.length < 3) return msg.channel.createMessage(':question:   **»**   You must provide a tag value.');
			this.r.table('tags').filter({ guildID: msg.channel.guild.id, name: args[1].toLowerCase() }).run((error, tags) => {
				if (error) return handleDatabaseError(error, msg);
				if (tags.length > 0) return msg.channel.createMessage(':exclamation:   **»**   A tag already exists with that name in this server.');
				this.r.table('tags').insert({
					guildID: msg.channel.guild.id,
					name: args[1].toLowerCase(),
					value: args.slice(2).join(' '),
					userID: msg.author.id
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					msg.channel.createMessage(':white_check_mark:   **»**   Added tag `' + args[1].toLowerCase() + '` to the database.');
				});
			});
		} else if (args[0].toLowerCase() === 'delete') {
			if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide a tag name.');
			this.r.table('tags').filter({ guildID: msg.channel.guild.id, name: args[1].toLowerCase() }).run((error, tags) => {
				if (error) return handleDatabaseError(error, msg);
				if (tags.length < 1) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any tags by that name.');
				this.r.table('developers').get(msg.author.id).run((error, developer) => {
					if (error) return handleDatabaseError(error, msg);
					if (tags[0].userID !== msg.author.id && !msg.member.permission.has('manageMessages') && !developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You need the `Manage Messages` permission, or be the tag owner in order to delete tags.');
					this.r.table('tags').filter({ guildID: msg.channel.guild.id, name: args[1].toLowerCase() }).delete().run((error) => {
						if (error) return handleDatabaseError(error, msg);
						msg.channel.createMessage(':white_check_mark:   **»**   Successfully deleted tag `' + args[1].toLowerCase() + '` from this server.');
					});
				});
			});
		} else if (args[0].toLowerCase() === 'edit') {
			if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide a tag name.');
			if (args.length < 3) return msg.channel.createMessage(':question:   **»**   You must provide a tag value.');
			this.r.table('tags').filter({ guildID: msg.channel.guild.id, name: args[1].toLowerCase() }).run((error, tags) => {
				if (error) return handleDatabaseError(error, msg);
				if (tags.length < 1) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any tags by that name.');
				this.r.table('developers').get(msg.author.id).run((error, developer) => {
					if (error) return handleDatabaseError(error, msg);
					if (tags[0].userID !== msg.author.id && !msg.member.permission.has('manageMessages') && !developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You need the `Manage Messages` permission, or be the tag owner in order to edit tags.');
					this.r.table('tags').filter({ guildID: msg.channel.guild.id, name: args[1].toLowerCase() }).update({ value: args.slice(2).join(' ') }).run((error) => {
						if (error) return handleDatabaseError(error, msg);
						msg.channel.createMessage(':white_check_mark:   **»**   Successfully updated tag `' + args[1].toLowerCase() + '` with a new value.');
					});
				});
			});
		} else if (args[0].toLowerCase() === 'list') {
			this.r.table('tags').filter({ guildID: msg.channel.guild.id }).run((error, tags) => {
				if (error) return handleDatabaseError(error, msg);
				if (tags.length < 1) return msg.channel.createMessage(':exclamation:   **»**   There are no tags in this server.');
				msg.channel.createMessage({
					embed: {
						title: 'Tags (' + tags.length + ')',
						color: this.bot.embedColor,
						description: tags.map((tag) => '• **' + tag.name + '**').join('\n\n')
					}
				});
			});
		} else {
			this.r.table('tags').filter({ guildID: msg.channel.guild.id, name: args[0].toLowerCase() }).run((error, tags) => {
				if (error) return handleDatabaseError(error, msg);
				if (tags.length < 1) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any tags by that name.');
				msg.channel.createMessage(tags[0].value);
			});
		}
	}
}

module.exports = Tag;