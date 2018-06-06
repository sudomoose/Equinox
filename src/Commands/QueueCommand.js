const BaseCommand = require('../Structure/BaseCommand');

class Queue extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'queue',
			aliases: [],
			description: 'Get all of the songs in the queue.',
			category: 'Music',
			usage: 'queue',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   You cannot use this command in a direct message.');
		if (!msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   You must be in a voice channel in order to use this command.');
		if (!this.bot.voiceConnections.has(msg.channel.guild.id)) return msg.channel.createMessage(':no_entry_sign:   **»**   I am not playing any music within that channel.');
		if (this.bot.voiceConnections.get(msg.channel.guild.id).channelId !== msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   I am already playing music within a different voice channel. Please join that channel instead.');
		if (!this.bot.queue.has(msg.channel.guild.id)) return msg.channel.createMessage(':exclamation:   **»**   I am not playing any music in that voice channel.');
		const queue = this.bot.queue.get(msg.channel.guild.id);
		if (queue.queue.length < 2) return msg.channel.createMessage(':exclamation:   **»**   There are no songs in the queue. Add more!');
		msg.channel.createMessage({
			embed: {
				title: 'Queue',
				color: this.bot.embedColor,
				description: queue.queue.slice(1).map((song) => '`' + (queue.queue.slice(1).indexOf(song) + 1) + '. ' + song.info.title + '`').join('\n')
			}
		});
	}
}

module.exports = Queue;