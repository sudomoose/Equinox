const BaseCommand = require('../Structure/BaseCommand');

class Help extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'help',
			aliases: [],
			description: 'Gets a list of commands sent to your channel.',
			category: 'Utility',
			usage: 'help',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		let help = 'All of this bot\'s commands are listed below, along with the category that they belong in. Each of the commands will start with `' + msg.prefix + '`. For example: `' + msg.prefix + 'prefix`.';
		const categories = {};
		this.bot.commands.filter((command) => !command.hidden).forEach((command) => {
			if (!(command.category in categories)) categories[command.category] = [];
			categories[command.category].push(command.command);
		});
		for (const category in categories) {
			help += '\n\n**' + category + '**   **»**   ' + categories[category].map((command) => '`' + command + '`').join('   ');
		}
		help += '\n\nIf you need more assistance with the bot, type `' + msg.prefix + 'support` and join the server.';
		msg.channel.createMessage(help);
	}
}

module.exports = Help;