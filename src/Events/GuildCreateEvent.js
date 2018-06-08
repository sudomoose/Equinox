const updateGuildCount = require('../Util/updateGuildCount');

module.exports = (bot) => {
	bot.on('guildCreate', () => {
		updateGuildCount(bot);
	});
};