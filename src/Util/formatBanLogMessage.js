const config = require('../config.json');

module.exports = (bot, guild, member, reason, caseID, moderator) => ':hammer:    A user was banned | Case ' + caseID + '\n**User**: ' + member.username + '#' + member.discriminator + ' (' + member.id + ')\n**Reason**: ' + (reason ? '`' + reason + '`' : 'Use `' + (bot.prefixes.has(guild.id) ? bot.prefixes.get(guild.id) : config.default_prefix) + 'reason ' + caseID + ' <reason...>` to update the reason.') + '\n**Moderator**: ' + (moderator ? moderator.username + '#' + moderator.discriminator + ' (' + moderator.id + ')' : 'Unknown');