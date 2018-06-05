const handleDatabaseError = require('../Util/handleDatabaseError');

module.exports = (bot, r) => {
	bot.on('presenceUpdate', (presence) => {
		r.table('uptime').get(presence.user.id).run((error, uptime) => {
			if (error) return handleDatabaseError(error);
			if (uptime) {
				if (presence.status !== 'offline' && uptime.status === 'offline') {
					r.table('uptime').get(presence.user.id).update({
						since: Date.now(),
						status: 'online'
					}).run((error) => {
						if (error) return handleDatabaseError(error);
					});
				} else if (presence.status === 'offline' && uptime.status === 'online') {
					r.table('uptime').get(presence.user.id).update({
						since: Date.now(),
						status: 'offline',
						duration: Date.now() - uptime.since
					}).run((error) => {
						if (error) return handleDatabaseError(error);
					});
				}
			} else {
				r.table('uptime').insert({
					id: presence.user.id,
					status: presence.status !== 'offline' ? 'online' : 'offline',
					since: presence.status !== 'offline' ? Date.now() : null,
					duration: 0,
					timestamp: Date.now()
				}).run((error) => {
					if (error) return handleDatabaseError(error);
				});
			}
		});
	});
};