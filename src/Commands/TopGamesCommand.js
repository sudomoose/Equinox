const humanizeDuration = require('humanize-duration');
const handleDatabaseError = require('../Util/handleDatabaseError');
const BaseCommand = require('../Structure/BaseCommand');

class TopGames extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'top-games',
			aliases: [
				'topgames',
				'top-played',
				'topplayed'
			],
			description: 'View the longest games played recorded by the bot.',
			category: 'Information',
			usage: 'top-games',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		this.r.table('games').count().run((error, gameCount) => {
			if (error) return handleDatabaseError(error, msg);
			let page = 1;
			if (args.length > 0) {
				if (isNaN(args[0])) return msg.channel.createMessage(':exclamation:   **»**   The page must be a valid number.');
				if (Number(args[0]) < 1) return msg.channel.createMessage(':exclamation:   **»**   The page number must be greater than or equal to 1.');
				if (Number(args[0]) > Math.ceil(gameCount / 15)) return msg.channel.createMessage(':exclamation:   **»**   Page `' + args[0] + '` does not exist.');
				page = Number(args[0]);
			}
			this.r.table('games').merge((row) => ({ duration: row('duration').add(this.r.args(row('users').map((user) => this.r.expr(Date.now()).sub(user('timestamp'))))) })).orderBy(this.r.desc('duration')).slice((page * 15) - 15, page * 15).run((error, games) => {
				if (error) return handleDatabaseError(error, msg);
				games = games.map((game) => { game.id = game.id.replace(/ +/g, ' '); return game; });
				const largestName = Math.max(...games.map((game, index) => ((index + 1) + '. ' + game.id).length));
				msg.channel.createMessage('```\n' + games.map((game, index) => (index + 1) + '. ' + game.id + Array((largestName + 4) - ((index + 1) + '. ' + game.id).length).join(' ') + humanizeDuration(game.duration, { largest: 1 }) + ' (' + game.users.length + ' playing)').join('\n') + '\n\nPage ' + page + ' / ' + Math.ceil(gameCount / 15) + '```');
			});
		});
	}
}

module.exports = TopGames;