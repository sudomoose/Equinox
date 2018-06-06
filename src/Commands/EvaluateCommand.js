const util = require('util');
const BaseCommand = require('../Structure/BaseCommand');
const uploadToHastebin = require('../Util/uploadToHastebin');
const formatArbitrary = require('../Util/formatArbitrary');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Evaluate extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'eval',
			aliases: [
				'run'
			],
			description: 'Runs JavaScript code within the process.',
			category: 'Developers',
			usage: 'eval <code...>',
			hidden: true
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		this.r.table('developers').get(msg.author.id).run(async (error, developer) => {
			if (error) return handleDatabaseError(error, msg);
			if (!developer) return msg.channel.createMessage(':no_entry_sign:   **»**   You do not have permission to run this command.');
			try {
				let result = await eval(args.join(' '));
				if (typeof result !== 'string') result = util.inspect(result);
				result = formatArbitrary(result);
				if (result.length > 1992) {
					uploadToHastebin(result).then((url) => {
						msg.channel.createMessage(':outbox_tray:   **»**   ' + url);
					}).catch((error) => {
						msg.channel.createMessage(':exclamation:   **»**   Failed to upload result to hastebin. `' + error.message + '`');
					});
				} else {
					msg.channel.createMessage('```js\n' + result + '```');
				}
			} catch (e) {
				msg.channel.createMessage('```js\n' + e + '```');
			}
		});
	}
}

module.exports = Evaluate;
