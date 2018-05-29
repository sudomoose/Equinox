const handleDatabaseError = require('./handleDatabaseError');
const handleGiveaway = require('./handleGiveaway');

module.exports = (bot, r) => {
	r.table('giveaways').run((error, giveaways) => {
		if (error) return handleDatabaseError(error);
		for (let i = 0; i < giveaways.length; i++) {
			handleGiveaway(bot, r, giveaways[i].id);
		}
	});
};