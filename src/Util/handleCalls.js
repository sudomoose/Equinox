const handleDatabaseError = require('./handleDatabaseError');

module.exports = (bot, r) => {
	r.table('calls').run((error, calls) => {
		if (error) return handleDatabaseError(error);
		for (let i = 0; i < calls.length; i++) {
			bot.calls.set(calls[i].caller, calls[i]);
		}
	});
};