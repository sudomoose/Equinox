const humanizeDuration = require('humanize-duration');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Reminder {
	constructor(bot, r, reminder) {
		this.bot = bot;
		this.r = r;
		this.reminder = reminder;
		this.interval = null;
		if (reminder.end - Date.now() > 2147483647) {
			this.waitMaxDuration();
		} else {
			this.wait();
		}
	}

	wait() {
		this.interval = setTimeout(() => {
			this.deleteReminder().then(() => {
				const user = this.bot.users.get(this.reminder.userID);
				if (user) {
					user.getDMChannel().then((user) => {
						user.createMessage(':alarm_clock:   **»**   About ' + humanizeDuration(this.reminder.duration, { round: true }) + ' ago, you asked me to remind you about `' + this.reminder.message + '`.');
					});
				}
			}).catch((error) => {
				handleDatabaseError(error);
			});
		}, Math.max(this.reminder.end - Date.now(), 0));
	}

	waitMaxDuration() {
		this.interval = setTimeout(() => {
			if (this.reminder.end - Date.now() <= 2147483647) {
				this.wait();
			} else {
				this.waitMaxDuration();
			}
		}, 2147483647);
	}

	deleteReminder() {
		return this.r.table('reminders').get(this.reminder.id).delete().run();
	}

	stop() {
		clearInterval(this.interval);
	}
}

module.exports = Reminder;