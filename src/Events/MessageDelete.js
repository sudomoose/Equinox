const handleDatabaseError = require('../Util/handleDatabaseError');

module.exports = (bot, r) => {
	bot.on('messageDelete', (message) => {
		if (!message.content || !message.channel.guild || !message.author) return;
		r.table('snipe_opt_out').get(message.author.id).run((error, result) => {
			if (error) return handleDatabaseError(error);
			if (result) return;
			r.table('snipes').insert({
				id: message.channel.id,
				content: message.embeds.length > 0 ? message.embeds[0] : message.content,
				author: message.author.toJSON(),
				timestamp: message.timestamp
			}, { conflict: 'replace' }).run((error) => {
				if (error) return handleDatabaseError(error);
				r.table('settings').get(message.channel.guild.id).run((error, settings) => {
					if (error) return handleDatabaseError(error);
					if (settings && settings.autoSnipe) bot.commands.get('snipe').execute({
						channel: message.channel,
						author: bot.user
					}, []);
				});
			});
		});
	});
};