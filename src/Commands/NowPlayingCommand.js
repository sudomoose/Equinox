const BaseCommand = require('../Structure/BaseCommand');
const formatDuration = require('../Util/formatDuration');
const DescriptionBuilder = require('../Structure/DescriptionBuilder');

class Volume extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'now-playing',
			aliases: [
				'nowplaying',
				'np'
			],
			description: 'Shows the song that is currently playing.',
			category: 'Music',
			usage: 'nowplaying',
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
		msg.channel.createMessage({
			embed: {
				title: 'Now Playing',
				color: this.bot.embedColor,
				description: new DescriptionBuilder().addField('URL', '[' + queue.nowPlaying.info.title + '](' + queue.nowPlaying.info.uri + ')').addField('Author', queue.nowPlaying.info.author).addField('Duration', formatDuration(queue.position) + '/' + formatDuration(queue.nowPlaying.info.length)).build(),
				thumbnail: {
					url: 'https://img.youtube.com/vi/' + queue.nowPlaying.info.identifier + '/mqdefault.jpg'
				}
			}
		});
	}
}

module.exports = Volume;