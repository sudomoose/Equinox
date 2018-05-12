module.exports = (bot, r, metrics) => {
	bot.on('rawWS', (payload) => {
		metrics.increment('events.raw', 1);
		metrics.increment('events.top', [ 'event:' + String(payload.t) ]);
	});
};