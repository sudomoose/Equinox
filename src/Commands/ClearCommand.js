const BaseCommand = require('../Structure/BaseCommand');

class Resume extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'clear',
			aliases: [],
			description: 'Clears the queue and current song.',
			category: 'Music',
			usage: 'clear',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   You cannot use this command in a direct message.');
		if (!msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   You must be in a voice channel in order to use this command.');
		if (!this.bot.voiceConnections.has(msg.channel.guild.id)) return msg.channel.createMessage(':no_entry_sign:   **»**   I am not playing any music within that channel.');
		if (this.bot.voiceConnections.has(msg.channel.guild.id) && this.bot.voiceConnections.get(msg.channel.guild.id).channelId !== msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   I am already playing music within a different voice channel. Please join that channel instead.');
		if (!(msg.channel.guild.id in this.bot.queue)) return msg.channel.createMessage(':exclamation:   **»**   I am not playing any music in that voice channel.');
		const player = this.bot.voiceConnections.get(msg.channel.guild.id);
		const queue = this.bot.queue[msg.channel.guild.id];
		queue.queue = [];
		player.stop();
	}
}

module.exports = Resume;