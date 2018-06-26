const humanizeDuration = require('humanize-duration');
const dateformat = require('dateformat');
const handleDatabaseError = require('./handleDatabaseError');
const greenToRedPercentage = require('./greenToRedPercentage');
const DescriptionBuilder = require('../Structure/DescriptionBuilder');

module.exports = (bot, r, giveawayID) => {
	const update = setInterval(() => {
		r.table('giveaways').get(giveawayID).run((error, giveaway) => {
			if (error) return handleDatabaseError(error);
			if (!giveaway) return clearInterval(update);
			if (!(giveaway.channelID in bot.channelGuildMap)) return clearInterval(update);
			const channel = bot.guilds.get(bot.channelGuildMap[giveaway.channelID]).channels.get(giveaway.channelID);
			channel.getMessage(giveawayID).then((message) => {
				if (giveaway.cancelled) {
					message.edit({
						embed: {
							title: ':tada: Giveaway Ended :tada:',
							color: 0xFF0000,
							description: new DescriptionBuilder().addField('Prize', giveaway.prize).addField('Winners', giveaway.winners).addField('Time Remaining', '0 seconds').addField('Ends At', dateformat(giveaway.end, 'mm/dd/yyyy hh:MM:ss TT (HH:MM:ss)')).addField('Status', 'Cancelled').build()
						}
					});
					r.table('giveaways').get(giveawayID).delete().run((error) => {
						if (error) return handleDatabaseError(error);
					});
					clearInterval(update);
				} else if (Date.now() > giveaway.end) {
					let reactors = [];
					message.getReaction('🎉', 100).then((users) => {
						reactors.push(...users);
						if (reactors.length < message.reactions['🎉'].count) {
							nextBatchUsers(users[users.length - 1].id);
						} else {
							updateEndedMessage();
						}
					});
					const nextBatchUsers = (id) => {
						message.getReaction('🎉', 100, null, id).then((users) => {
							reactors.push(...users);
							if (reactors.length < message.reactions['🎉'].count) {
								nextBatchUsers(users[users.length - 1].id);
							} else {
								updateEndedMessage();
							}
						});
					};
					
					const updateEndedMessage = () => {
						reactors = reactors.filter((user) => !user.bot);
						if (reactors.length < giveaway.winners) {
							message.edit({
								embed: {
									title: ':tada: Giveaway Ended :tada:',
									color: 0xFF0000,
									description: new DescriptionBuilder().addField('Prize', giveaway.prize).addField('Winners', 'Not enough people entered to select winners.').addField('Time Remaining', '0 seconds').addField('Ends At', dateformat(giveaway.end, 'mm/dd/yyyy hh:MM:ss TT (HH:MM:ss)')).addField('Status', 'Ended').build()
								}
							});
							clearInterval(update);
							return r.table('giveaways').get(giveawayID).delete().run((error) => {
								if (error) return handleDatabaseError(error);
							});
						}
						const winners = [];
						for (let i = 0; i < giveaway.winners; i++) {
							winners.push(reactors[Math.floor(Math.random() * reactors.length)]);
						}
						message.edit({
							embed: {
								title: ':tada: Giveaway Ended :tada:',
								color: 0xFF0000,
								description: new DescriptionBuilder().addField('Prize', giveaway.prize).addField('Winners', winners.map((winner) => '<@' + winner.id + '>')).addField('Time Remaining', '0 seconds').addField('Ends At', dateformat(giveaway.end, 'mm/dd/yyyy hh:MM:ss TT (HH:MM:ss)')).addField('Status', 'Ended').build()
							}
						});
						message.channel.createMessage(':tada:   **»**   Congratulations to ' + winners.map((winner, i) => (i + 1 === winners.length && winners.length > 1 ? 'and ' : '') + '<@' + winner.id + '>').join(', ') + ', you won **' + giveaway.prize + '**!');
						clearInterval(update);
						r.table('giveaways').get(giveawayID).delete().run((error) => {
							if (error) return handleDatabaseError(error);
						});
					};
				} else {
					message.edit({
						embed: {
							title: ':tada: Giveaway :tada:',
							color: greenToRedPercentage((Date.now() - giveaway.timestamp) / (giveaway.end - giveaway.timestamp)),
							description: new DescriptionBuilder().addField('Prize', giveaway.prize).addField('Winners', giveaway.winners).addField('Time Remaining', humanizeDuration(giveaway.end - Date.now(), { round: true })).addField('Ends At', dateformat(giveaway.end, 'mm/dd/yyyy hh:MM:ss TT (HH:MM:ss)')).addField('Status', 'Active').build()
						}
					});
				}
			}).catch(() => {
				clearInterval(update);
			});
		});
	}, 5000);
};