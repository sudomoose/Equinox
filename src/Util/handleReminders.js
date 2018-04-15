const humanizeDuration = require('humanize-duration');
const handleDatabaseError = require('./handleDatabaseError');

module.exports = (bot, r) => {
	r.table('reminders').run((error, reminders) => {
		if (error) return handleDatabaseError(error);
		for (let i = 0; i < reminders.length; i++) {
			const reminder = reminders[i];
			if (reminder.end - Date.now() > 2147483647) {
				const wait = () => {
					if (reminder.end - Date.now() <= 2147483647) {
						bot.reminders.set(reminder.id, setTimeout(() => {
							r.table('reminders').get(reminder.id).delete().run((error) => {
								if (error) return handleDatabaseError(error);
								const user = bot.users.get(reminder.userID);
								if (user) {
									user.getDMChannel().then((user) => {
										user.createMessage(':alarm_clock:   **»**   About ' + humanizeDuration(reminder.duration, { round: true }) + ' ago, you asked me to remind you about `' + reminder.message + '`.');
									});
								}
							});
						}, Math.max(reminder.end - Date.now(), 0)));
					} else {
						bot.reminders.set(reminder.id, setTimeout(wait, 2147483647));
					}
				};
				wait();
			} else {
				bot.reminders.set(reminder.id, setTimeout(() => {
					r.table('reminders').get(reminder.id).delete().run((error) => {
						if (error) return handleDatabaseError(error);
						const user = bot.users.get(reminder.userID);
						if (user) {
							user.getDMChannel().then((user) => {
								user.createMessage(':alarm_clock:   **»**   About ' + humanizeDuration(reminder.duration, { round: true }) + ' ago, you asked me to remind you about `' + reminder.message + '`.');
							});
						}
					});
				}, Math.max(reminder.end - Date.now(), 0)));
			}
		}
	});
};