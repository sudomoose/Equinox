const BaseCommand = require('../Structure/BaseCommand');

class Skip extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'skip',
			aliases: [],
			description: 'Skips the currently playing song.',
			category: 'Music',
			usage: 'skip',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   You cannot use this command in a direct message.');
		if (!msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   You must be in a voice channel in order to use this command.');
		if (this.bot.voiceConnections.has(msg.channel.guild.id) && this.bot.voiceConnections.get(msg.channel.guild.id).channelId !== msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   I am already playing music within a different voice channel. Please join that channel instead.');
		if (!(msg.channel.guild.id in this.bot.queue)) return msg.channel.createMessage(':exclamation:   **»**   I am not playing any music in that voice channel.');
		const player = this.bot.voiceConnections.get(msg.channel.guild.id);
		player.stop();
	}
}

module.exports = Skip;