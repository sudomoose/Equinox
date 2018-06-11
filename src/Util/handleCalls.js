const handleDatabaseError = require('./handleDatabaseError');
const Call = require('../Structure/Call');

module.exports = (bot, r) => {
	r.table('calls').run((error, calls) => {
		if (error) return handleDatabaseError(error);
		for (let i = 0; i < calls.length; i++) {
			if (!(calls[i].caller.id in bot.channelGuildMap) || !(calls[i].callee.id in bot.channelGuildMap)) return r.table('calls').get(calls[i].id).delete().run((error) => {
				if (error) return handleDatabaseError(error);
			});
			bot.calls.set(calls[i].id, new Call(r, {
				...calls[i],
				callerChannel: bot.guilds.get(bot.channelGuildMap[calls[i].caller.id]).channels.get(calls[i].caller.id),
				calleeChannel: bot.guilds.get(bot.channelGuildMap[calls[i].callee.id]).channels.get(calls[i].callee.id)
			}));
		}
	});
};