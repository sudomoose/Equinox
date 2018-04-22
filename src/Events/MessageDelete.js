const handleDatabaseError = require('../Util/handleDatabaseError');

module.exports = (bot, r) => {
	bot.on('messageDelete', (message) => {
		if (!message.content) return;
		r.table('snipes').insert({
			id: message.channel.id,
			content: message.embeds.length > 0 ? message.embeds[0] : message.content,
			author: message.author.toJSON(),
			timestamp: message.timestamp
		}, { conflict: 'replace' }).run((error) => {
			if (error) return handleDatabaseError(error);
		});
	});
};