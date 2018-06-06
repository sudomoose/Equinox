const snekfetch = require('snekfetch');
const BaseCommand = require('../Structure/BaseCommand');
const resolveTrack = require('../Util/resolveTrack');
const getPlayer = require('../Util/getPlayer');
const VoiceConnection = require('../Structure/VoiceConnection');
const Logger = require('../Util/Logger');
const config = require('../config.json');

class Play extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
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
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   You cannot use this command in a direct message.');
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a query.');
		if (!msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   You must be in a voice channel in order to use this command.');
		if (this.bot.voiceConnections.has(msg.channel.guild.id) && this.bot.voiceConnections.get(msg.channel.guild.id).channelId !== msg.member.voiceState.channelID) return msg.channel.createMessage(':no_entry_sign:   **»**   I am already playing music within a different voice channel. Please join that channel instead.');
		const playlist = args.join(' ').match(/(\?|&)list=([a-zA-Z0-9\-_]+)/);
		const play = () => {
			resolveTrack((/^https?:\/\//.test(args.join(' ')) ? '' : 'ytsearch:') + args.join(' ')).then((results) => {
				if (results.length < 1) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any videos by that query.');
				if (this.bot.voiceConnections.has(msg.channel.guild.id) && this.bot.queue.has(msg.channel.guild.id)) {
					this.bot.queue.get(msg.channel.guild.id).queueSong(results, playlist);
				} else {
					getPlayer(this.bot, msg.member.voiceState.channelID, msg.channel.guild.id).then((player) => {
						this.bot.queue.set(msg.channel.guild.id, new VoiceConnection(this.bot, player, msg.channel, results, playlist));
					}).catch((error) => {
						Logger.error(error);
					});
				}
			}).catch((error) => {
				msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
				Logger.error('Failed to resolve videos', error);
			});
		};
		if (playlist) {
			args = [ 'https://youtube.com/playlist?list=' + playlist[2] ];
			snekfetch.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + playlist[2] + '&key=' + config.api_keys.youtube + '&maxResults=0').then(() => {
				play();
			}).catch((error) => {
				if (error.statusCode === 404) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any playlists by that ID.');
				msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
				Logger.error('Failed to get YouTube playlist', error);
			});
		} else {
			play();
		}
	}
}

module.exports = Play;