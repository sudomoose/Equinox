module.exports = (bot, query) => {
	return new Promise((resolve, reject) => {
		if (/^\d+$/.test(query)) {
			const guilds = bot.guilds.filter((guild) => guild.roles.has(query));
			if (guilds.length > 0) return resolve(guilds[0].roles.get(query));
		} else if (/^<@&(\d+)>$/.test(query)) {
			const match = query.match(/^<@&(\d+)>$/);
			const guilds = bot.guilds.filter((guild) => guild.roles.has(match[0]));
			if (guilds.length > 0) return resolve(guilds[0].roles.get(match[0]));
		} else {
			const guilds = bot.guilds.filter((guild) => guild.roles.filter((role) => role.name.toLowerCase().includes(query.toLowerCase())).length > 0);
			if (guilds.length > 0) return resolve(guilds[0].roles.filter((role) => role.name.toLowerCase().includes(query.toLowerCase()))[0]);
		}
		reject();
	});
};