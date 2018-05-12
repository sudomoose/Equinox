module.exports = (bot, r, metrics) => {
	bot.on('rawWS', (payload) => {
		metrics.increment('events.raw', 1);
		metrics.increment('events.top', 1, [ 'event:' + String(payload.t) ]);
	});
};