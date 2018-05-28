const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Call extends BaseCommand {
	constructor(bot, r, metrics) {
		super({
			command: 'acceptcall',
			aliases: [
				'acall'
			],
			description: 'Accept your current incoming call.',
			category: 'Fun',
			usage: 'acceptcall',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
	}

	execute(msg) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
		this.r.table('registrations').get(msg.channel.id).run((error, registeration) => {
			if (error) return handleDatabaseError(error, msg);
			if (!registeration) return msg.channel.createMessage(':exclamation:   **»**   This channel does not have an assigned phone number. Use `' + msg.prefix + 'register` to get one.');
			this.r.table('calls').filter({ callee: registeration.number }).run((error, calls) => {
				if (error) return handleDatabaseError(error, msg);
				if (calls.length < 1) return msg.channel.createMessage(':exclamation:   **»**   You do not have any incoming calls at this time.');
				if (!(calls[0].calleeChannelID in this.bot.channelGuildMap)) {
					msg.channel.createMessage(':exclamation:   **»**   The channel that was calling you is no longer available');
					this.r.table('calls').get(calls[0].id).delete().run((error) => {
						if (error) return handleDatabaseError(error);
					});
					this.bot.calls.delete(calls[0].caller);
					return;
				}
				this.r.table('calls').get(calls[0].id).update({
					accepted: true
				}).run((error) => {
					if (error) return handleDatabaseError(error, msg);
					this.bot.calls.set(calls[0].caller, {
						callee: calls[0].callee,
						accepted: true
					});
					const otherSide = this.bot.guilds.get(this.bot.channelGuildMap[calls[0].callerChannelID]).channels.get(calls[0].callerChannelID);
					msg.channel.createMessage(':telephone:   **»**   You have accepted the incoming call. You are now talking with #' + otherSide.name + ' in ' + otherSide.guild.name + '.');
					otherSide.createMessage(':telephone:   **»**   The other side accepted the call. You are now talking with #' + msg.channel.name + ' in ' + msg.channel.guild.name + '.');
				});
			});
		});
	}
}

module.exports = Call;