const BaseCommand = require('../Structure/BaseCommand');

class Resume extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'resume',
			aliases: [],
			description: 'Resumes playing the current song.',
			category: 'Music',
			usage: 'resume',
			hidden: false,
			guildOnly: true
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg) {
		if (!msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   You must be in a voice channel in order to use this command.');
		if (!this.bot.voiceConnections.has(msg.channel.guild.id)) return msg.channel.createMessage(':no_entry_sign:   **»**   I am not playing any music within that channel.');
		if (this.bot.voiceConnections.get(msg.channel.guild.id).channelId !== msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   I am already playing music within a different voice channel. Please join that channel instead.');
		if (!this.bot.queue.has(msg.channel.guild.id)) return msg.channel.createMessage(':exclamation:   **»**   I am not playing any music in that voice channel.');
		const queue = this.bot.queue.get(msg.channel.guild.id);
		if (!queue.paused) return msg.channel.createMessage(':exclamation:   **»**   The current song is already playing.');
		queue.pause(false);
	}
}

module.exports = Resume;