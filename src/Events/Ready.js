const Logger = require('../Util/Logger.js');
const handleReminders = require('../Util/handleReminders');
const updateGuildCount = require('../Util/updateGuildCount');

module.exports = (bot, r) => {
	bot.on('ready', () => {
		Logger.info('Successfully logged in as ' + bot.user.username + '.');

		if (r) handleReminders(bot, r);
		updateGuildCount(bot);
	});
};