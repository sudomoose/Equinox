const handleDatabaseError = require('../Util/handleDatabaseError');

module.exports = (bot, r) => {
	bot.on('messageReactionAdd', (message, emoji, userID) => {
		message.channel.getMessage(message.id).then((message) => {
			if (emoji.name === '❌' && message.author.id === bot.user.id) {
				r.table('developers').get(userID).run((error, developer) => {
					if (error) return handleDatabaseError(error, message);
					if (!developer) return;
					message.delete();
				});
			}
		});
	});
};