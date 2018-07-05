const handleDatabaseError = require('../Util/handleDatabaseError');

module.exports = (bot, r, i18n, metrics, secondaryDB) => {
	bot.on('presenceUpdate', (presence, oldPresence) => {
		if (!presence || !oldPresence) return;
		/* secondaryDB.all('SELECT * FROM uptime WHERE userID = ?', presence.user.id, (error, uptime) => {
			if (error) return handleDatabaseError(error);
			if (uptime.length > 0) {
				if (presence.status !== 'offline' && oldPresence.status === 'offline') {
					secondaryDB.run('UPDATE uptime SET since = ?, status = "online" WHERE userID = ?', Date.now(), presence.user.id, (error) => {
						if (error) return handleDatabaseError(error);
					});
				} else if (presence.status === 'offline' && oldPresence.status !== 'offline') {
					secondaryDB.run('UPDATE uptime SET duration = (duration + ?), since = ?, status = "offline" WHERE userID = ?', Date.now() - uptime[0].since, Date.now(), presence.user.id, (error) => {
						if (error) return handleDatabaseError(error);
					});
				}
			} else {
				secondaryDB.run('INSERT INTO uptime (userID, since, status, duration, timestamp) VALUES (?, ?, ?, ?, ?)', presence.user.id, Date.now(), presence.status !== 'offline' ? 'online' : 'offline', 0, Date.now(), (error) => {
					if (error) return handleDatabaseError(error);
				});
			}
		});
		if (!oldPresence.game && presence.game && !presence.user.bot) {
			r.table('games').get(presence.game.name.slice(0, 127)).run((error, game) => {
				if (error) return handleDatabaseError(error);
				if (!presence.game) return; // race condition
				if (game) {
					if (game.users.filter((user) => user.id === presence.user.id).length > 0) return;
					r.table('games').get(presence.game.name.slice(0, 127)).update({
						users: r.row('users').append({
							id: presence.user.id,
							timestamp: Date.now()
						})
					}).run((error) => {
						if (error) return handleDatabaseError(error);
					});
				} else {
					r.table('games').insert({
						id: presence.game.name.slice(0, 127),
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
		} else if (oldPresence.game && !presence.game && !presence.user.bot) {
			r.table('games').filter(r.row('users').filter((user) => user('id').eq(presence.user.id)).count().gt(0)).run((error, games) => {
				if (error) return handleDatabaseError(error);
				for (let i = 0; i < games.length; i++) {
					r.table('games').get(games[i].id).update({ duration: r.row('duration').add(Date.now() - games[i].users.filter((user) => user.id === presence.user.id)[0].timestamp), users: games[i].users.filter((user) => user.id !== presence.user.id) }).run((error) => {
						if (error) return handleDatabaseError(error); 
					});
				}
			});
		} */
	});
};