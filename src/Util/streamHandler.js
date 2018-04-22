const config = require('../config.json');
const formatDuration = require('./formatDuration');

module.exports = (bot, player, queue, channel) => {
	const play = () => {
		const song = queue.queue[0];
		player.play(song.track);
		channel.createMessage({
			embed: {
				title: 'Now Playing',
				color: bot.embedColor,
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
	};

	player.on('end', () => {
		queue.queue.splice(0, 1);
		if (queue.queue.length > 0) return play();
		player.stop();
		bot.leaveVoiceChannel(player.channelId);
		channel.createMessage(':eject:   **»**   The queue has ended. If you enjoyed the music, please consider donating to keep music alive. <' + config.links.donate + '>');
	});

	play();
};