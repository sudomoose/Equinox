const Logger = require('../Util/Logger.js');
const handleReminders = require('../Util/handleReminders');

module.exports = (bot, r) => {
	bot.on('ready', () => {
		Logger.info('Successfully logged in as ' + bot.user.username + '.');

		handleReminders(bot, r);
	});
};