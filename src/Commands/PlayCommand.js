const BaseCommand = require('../Structure/BaseCommand');
const resolveTrack = require('../Util/resolveTrack');
const streamHandler = require('../Util/streamHandler');
const getPlayer = require('../Util/getPlayer');
const formatDuration = require('../Util/formatDuration');
const Logger = require('../Util/Logger');

class Play extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'play',
			aliases: [],
			description: 'Plays music within your voice channel.',
			category: 'Music',
			usage: 'play <query>',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   You cannot use this command in a direct message.');
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a query.');
		if (!msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   You must be in a voice channel in order to use this command.');
		if (this.bot.voiceConnections.has(msg.channel.guild.id) && this.bot.voiceConnections.get(msg.channel.guild.id).channelId !== msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   I am already playing music within a different voice channel. Please join that channel instead.');
		const playlist = /^https?:\/\/www\.youtube\.com\/playlist\?list=[a-zA-Z0-9]*$/.test(args.join(' '));
		resolveTrack((/^https?:\/\//.test(args.join(' ')) ? '' : 'ytsearch:') + args.join(' ')).then((results) => {
			if (results.length < 1) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any videos by that query.');
			if (!(msg.channel.guild.id in this.bot.queue)) this.bot.queue[msg.channel.guild.id] = {
				queue: []
			};
			const queue = this.bot.queue[msg.channel.guild.id];
			if (playlist) {
				queue.queue.push(...results);
			} else {
				queue.queue.push(results[0]);
			}
			if (this.bot.voiceConnections.has(msg.channel.guild.id)) {
				if (playlist) {
					msg.channel.createMessage(':white_check_mark:   **»**   Added `' + results.length + '` songs to the queue.');
				} else {
					msg.channel.createMessage({
						embed: {
							title: 'Added to Queue',
							color: this.bot.embedColor,
							description: results[0].info.title,
							fields: [
								{
									name: 'Author',
									value: results[0].info.author,
									inline: true
								},
								{
									name: 'Duration',
									value: formatDuration(results[0].info.length),
									inline: true
								},
								{
									name: 'Stream',
									value: results[0].info.isStream ? 'Yes' : 'No',
									inline: true
								},
								{
									name: 'Position in Queue',
									value: queue.queue.length,
									inline: true
								},
								{
									name: 'Time Until Played',
									value: formatDuration(queue.queue.slice(0, queue.queue.length - 1).filter((song) => !song.info.isStream).map((song) => song.info.length).reduce((a, b) => a + b, 0)),
									inline: true
								}
							]
						}
					});
				}
			} else {
				getPlayer(this.bot, msg.member.voiceState.channelID, msg.channel.guild.id).then((player) => {
					streamHandler(this.bot, player, queue, msg.channel);
				}).catch((error) => {
					Logger.error(error);
				});
			}
		}).catch((error) => {
			msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
			Logger.error('Failed to resolve videos', error);
		});
	}
}

module.exports = Play;