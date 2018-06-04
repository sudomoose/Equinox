const formatDuration = require('../Util/formatDuration');
const config = require('../config.json');

class VoiceConnection {
	constructor(bot, player, channel, results, playlist) {
		this.bot = bot;
		this.player = player;
		this.queue = [];
		this.channel = channel;
		this.volume = 100;
		this.queueSong(results, playlist);
		this.playNext();
		this.player.on('end', this.songEnd.bind(this));
	}

	playNext() {
		const song = this.queue[0];
		this.player.play(song.track);
		this.channel.createMessage({
			embed: {
				title: 'Now Playing',
				color: this.bot.embedColor,
				description: '[' + song.info.title + '](https://youtube.com/watch?v=' + song.info.identifier + ')',
				thumbnail: {
					url: 'https://img.youtube.com/vi/' + song.info.identifier + '/mqdefault.jpg'
				},
				fields: [
					{
						name: 'Duration',
						value: formatDuration(song.info.length),
						inline: true
					},
					{
						name: 'Stream',
						value: song.info.isStream ? 'Yes' : 'No',
						inline: true
					}
				]
			}
		});
	}

	queueSong(results, playlist) {
		if (playlist) {
			this.queue.push(...results);
			this.channel.createMessage(':white_check_mark:   **»**   Added `' + results.length + '` songs to the queue.');
		} else {
			if (this.queue.length > 0) this.channel.createMessage({
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
							name: 'Position in Queue',
							value: this.queue.length,
							inline: true
						}
					]
				}
			});
			this.queue.push(results[0]);
		}
	}
	
	songEnd() {
		this.queue.splice(0, 1);
		if (this.queue.length > 0) return this.playNext();
		this.player.stop();
		this.bot.leaveVoiceChannel(this.player.channelId);
		this.sendQueueEnd();
	}

	sendQueueEnd() {
		this.channel.createMessage(':eject:   **»**   The queue has ended. If you enjoyed the music, please consider donating to keep music alive. <' + config.links.donate + '>');
	}

	clear() {
		this.queue = [];
		this.player.stop();
	}

	pause(bool) {
		this.player.pause(bool);
	}

	skip() {
		this.player.stop();
	}

	setVolume(volume) {
		this.player.setVolume(volume);
		this.volume = volume;
	}

	get paused() {
		return this.player.paused;
	}

	get nowPlaying() {
		return this.queue[0];
	}

	get position() {
		return this.player.state.position;
	}
}

module.exports = VoiceConnection;