module.exports = (r, guildID, value) => {
	return new Promise((resolve, reject) => {
		r.table('settings').get(guildID).run((error, settings) => {
			if (error) return reject(error);
			if (settings) {
				r.table('settings').get(guildID).update(value).run((error) => {
					if (error) return reject(error);
					resolve();
				});
			} else {
				r.table('settings').insert({
					id: guildID,
					joinMessages: {
						enabled: 'joinMessages' in value && 'enabled' in value.joinMessages ? value.joinMessages.enabled : false,
						channelID: 'joinMessages' in value && 'channelID' in value.joinMessages ? value.joinMessages.channelID : null,
						message: 'joinMessages' in value && 'message' in value.joinMessages ? value.joinMessages.message : null
					},
					leaveMessages: {
						enabled: 'leaveMessages' in value && 'enabled' in value.leaveMessages ? value.leaveMessages.enabled : false,
						channelID: 'leaveMessages' in value && 'channelID' in value.leaveMessages ? value.leaveMessages.channelID : null,
						message: 'leaveMessages' in value && 'message' in value.leaveMessages ? value.leaveMessages.message : null
					},
					banLog: {
						enabled: 'banLog' in value && 'enabled' in value.banLog ? value.banLog.enabled : false,
						channelID: 'banLog' in value && 'channelID' in value.banLog ? value.banLog.channelID : null
					},
					kickLog: {
						enabled: 'kickLog' in value && 'enabled' in value.kickLog ? value.kickLog.enabled : false,
						channelID: 'kickLog' in value && 'channelID' in value.kickLog ? value.kickLog.channelID : null
					},
					autoSnipe: 'autoSnipe' in value ? value.autoSnipe : false
				}).run((error) => {
					if (error) return reject(error);
					resolve();
				});
			}
		});
	});
};