const dateformat = require('dateformat');

module.exports = (message, member, guild) => {
	return message
		.split('{user.id}').join(member.user.id)
		.split('{user.mention}').join('<@' + member.user.id + '>')
		.split('{user.createdAt.time}').join(dateformat(member.user.createdAt, 'hh:MM:ss TT'))
		.split('{user.createdAt.date}').join(dateformat(member.user.createdAt, 'mm/dd/yyyy'))
		.split('{user.createdAt.datetime}').join(dateformat(member.user.createdAt, 'mm/dd/yyyy hh:MM:ss TT'))
		.split('{user.joinedAt.time}').join(dateformat(member.user.joinedAt, 'hh:MM:ss TT'))
		.split('{user.joinedAt.date}').join(dateformat(member.user.joinedAt, 'mm/dd/yyyy'))
		.split('{user.joinedAt.datetime}').join(dateformat(member.user.joinedAt, 'mm/dd/yyyy hh:MM:ss TT'))
		.split('{user.username}').join(member.user.username)
		.split('{user.discriminator}').join(member.user.discriminator)
		.split('{user.tag}').join(member.user.username + '#' + member.user.discriminator)
		.split('{user.avatarURL}').join(member.user.avatar ? member.user.avatarURL : member.user.defaultAvatarURL)
		.split('{date}').join(dateformat(Date.now(), 'mm/dd/yyyy'))
		.split('{time}').join(dateformat(Date.now(), 'hh:MM:ss TT'))
		.split('{datetime}').join(dateformat(Date.now(), 'mm/dd/yyyy hh:MM:ss TT'))
		.split('{guild.name}').join(guild.name)
		.split('{guild.id}').join(guild.id)
		.split('{guild.members}').join(guild.memberCount)
		.split('{guild.roles}').join(guild.roles.size)
		.split('{guild.emojis}').join(guild.emojis.length)
		.split('{guild.createdAt.time}').join(dateformat(guild.createdAt, 'hh:MM:ss TT'))
		.split('{guild.createdAt.date}').join(dateformat(guild.createdAt, 'mm/dd/yyyy'))
		.split('{guild.createdAt.datetime}').join(dateformat(guild.createdAt, 'mm/dd/yyyy hh:MM:ss TT'));
};