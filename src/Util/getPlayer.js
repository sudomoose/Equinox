module.exports = (bot, voiceChannel, guild) => {
	const player = bot.voiceConnections.get(guild);
	if (player) return Promise.resolve(player);
	return bot.joinVoiceChannel(voiceChannel);
};