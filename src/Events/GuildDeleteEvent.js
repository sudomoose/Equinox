const updateGuildCount = require('../Util/updateGuildCount');

module.exports = (bot) => {
	bot.on('guildDelete', () => {
		updateGuildCount(bot);
	});
};