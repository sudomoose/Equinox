const convert = require('convert-units');
const BaseCommand = require('../Structure/BaseCommand');
const config = require('../config.json');

class Convert extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'convert',
			aliases: [
				'conv'
			],
			description: 'Convert basic units with amounts.',
			category: 'Utility',
			usage: 'convert [<amount>] [<unit from>] [<unit to>]',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg, args) {
		if (args.length > 0) {
			if (isNaN(args[0])) return msg.channel.createMessage(':exclamation:   **»**   The amount must be a valid number.');
			if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide a unit to convert from.');
			if (args.length < 3) return msg.channel.createMessage(':question:   **»**   You must provide a unit to convert to.');
			if (!convert().possibilities().includes(args[1])) return msg.channel.createMessage(':exclamation:   **»**   `' + args[1] + '` is not a unit I know of. Make sure you spelled it right, and that it\'s capitalized correctly.');
			if (!convert().from(args[1]).possibilities().includes(args[2])) return msg.channel.createMessage(':exclamation:   **»**   `' + args[2] + '` is not a unit I know of, or cannot be converted to from `' + args[1] + '`. Make sure you spelled it right, and that it\'s capitalized correctly.');
			const output = convert(Number(args[0])).from(args[1]).to(args[2]);
			const from = convert().describe(args[1]);
			const to = convert().describe(args[2]);
			msg.channel.createMessage(':scales:   **»**   ' + args[0] + ' ' + (Number(args[0]) === 1 ? from.singular : from.plural).toLowerCase() + ' is approximately `' + output + '` ' + (output === 1 ? to.singular : to.plural).toLowerCase() + '.');
		} else {
			msg.channel.createMessage({
				embed: {
					title: 'Conversion Cheat Sheet',
					color: this.bot.embedColor,
					description: convert().measures().map((unit) => config.convert_category_emojis[unit] + ' **' + config.unit_renames[unit] + '**:   ' + convert().possibilities(unit).map((unit) => '`' + unit + '`').join(', ')).join('\n\n')
				}
			});
		}
	}
}

module.exports = Convert;