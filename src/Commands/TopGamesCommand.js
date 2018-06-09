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

	execute(msg) {
		this.r.table('games').merge((row) => ({ duration: row('duration').add(this.r.args(row('users').map((user) => this.r.expr(Date.now()).sub(user('timestamp'))))) })).orderBy(this.r.desc('duration')).limit(15).run((error, games) => {
			if (error) return handleDatabaseError(error, msg);
			const largestName = Math.max(...games.map((game) => game.id.length));
			msg.channel.createMessage({
				embed: {
					title: 'Top Played Games',
					color: this.bot.embedColor,
					description: games.map((game, index) => '`' + (index + 1) + '. ' + game.id + Array((largestName + 4) - game.id.length).join(' ') + humanizeDuration(game.duration, { round: true, largest: 1, units: [ 'h', 'm' ] }) + '`').join('\n')
				}
			});
		});
	}
}

module.exports = TopGames;