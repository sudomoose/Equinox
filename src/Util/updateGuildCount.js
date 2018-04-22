const snekfetch = require('snekfetch');
const config = require('../config.json');

module.exports = (bot) => {
	snekfetch.post('https://discordbots.org/api/bots/' + bot.user.id + '/stats').set('Authorization', config.api_keys['discordbots.org']).send({
		server_count: bot.guilds.size
	}).catch(() => {});
	snekfetch.post('https://bots.discord.pw/api/bots/' + bot.user.id + '/stats').set('Authorization', config.api_keys['bots.discord.pw']).send({
		server_count: bot.guilds.size
	}).catch(() => {});
	snekfetch.post('https://ls.terminal.ink/api/v1/bots/' + bot.user.id + '/').set('Authorization', config.api_keys['ls.terminal.ink']).send({
		server_count: bot.guilds.size
	}).catch(() => {});
	snekfetch.post('https://botlist.space/api/bots/' + bot.user.id + '/').set('Authorization', config.api_keys['botlist.space']).send({
		server_count: bot.guilds.size
	}).catch(() => {});
};