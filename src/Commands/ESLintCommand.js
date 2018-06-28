const Lint = require('eslint');
const BaseCommand = require('../Structure/BaseCommand');
const DescriptionBuilder = require('../Structure/DescriptionBuilder');

class ESLint extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'eslint',
			aliases: [
				'jslint'
			],
			description: 'Verifies inputted JavaScript code and tells you if there is errors.',
			category: 'Utility',
			usage: 'eslint <code...>',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
		this.linter = new Lint.Linter();
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide JavaScript code.');
		const output = this.linter.verify(args.join(' '), {
			env: {
				es6: true,
				node: true
			},
			extends: 'eslint:recommended',
			parserOptions: {
				sourceType: 'module',
				ecmaVersion: 2018
			}
		}, { filename: 'input.js' });
		if (output.length < 1) return msg.channel.createMessage(':white_check_mark:   **»**   There were no problems with that code.');
		msg.channel.createMessage({
			embed: {
				title: 'Error While Parsing',
				color: this.bot.embedColor,
				description: new DescriptionBuilder().addField('Message', output[0].message).addField('Location', 'line ' + output[0].line + ', column ' + output[0].column).addField('Fatal', output[0].fatal ? 'Yes' : 'No').build()
			}
		});
	}
}

module.exports = ESLint;