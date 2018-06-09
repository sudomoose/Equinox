const handleDatabaseError = require('../Util/handleDatabaseError');

module.exports = (bot, r) => {
	bot.on('presenceUpdate', (presence, oldPresence) => {
		if (!presence || !oldPresence) return;
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
		if (!oldPresence.game && presence.game) {
			r.table('games').get(presence.game.name).run((error, game) => {
				if (error) return handleDatabaseError(error);
				if (game) {
					r.table('games').get(presence.game.name).update({
						users: r.row('users').append({
							id: presence.user.id,
							timestamp: Date.now()
						})
					}).run((error) => {
						if (error) return handleDatabaseError(error);
					});
				} else {
					r.table('games').insert({
						id: presence.game.name,
						duration: 0,
						users: [
							{
								id: presence.user.id,
								timestamp: Date.now()
							}
						]
					}).run((error) => {
						if (error) return handleDatabaseError(error);
					});
				}
			});
		} else if (oldPresence.game && !presence.game) {
			r.table('games').filter(r.row('users').filter((user) => user('id').eq(presence.user.id))).run((error, games) => {
				if (error) return handleDatabaseError(error);
				for (let i = 0; i < games.length; i++) {
					r.table('games').get(games[i].id).update({ duration: r.row('duration').add(Date.now() - games[i].users.filter((user) => user.id === presence.user.id)[0].timestamp), users: games[i].users.filter((user) => user.id !== presence.user.id) }).run((error) => {
						if (error) return handleDatabaseError(error); 
					});
				}
			});
		}
	});
};