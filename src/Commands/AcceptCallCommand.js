const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Call extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
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
		this.i18n = i18n;
	}

	execute(msg) {
		if (!msg.channel.guild) return msg.channel.createMessage(this.i18n.__({ phrase: 'noDM', locale: msg.locale }));
		this.r.table('registrations').get(msg.channel.id).run((error, registeration) => {
			if (error) return handleDatabaseError(error, msg);
			if (!registeration) return msg.channel.createMessage(this.i18n.__({ phrase: 'acceptCall.noAssignedNumber', locale: msg.locale }, msg.prefix));
			this.r.table('calls').filter({ callee: registeration.number }).run((error, calls) => {
				if (error) return handleDatabaseError(error, msg);
				if (calls.length < 1) return msg.channel.createMessage(this.i18n.__({ phrase: 'acceptCall.noIncomingCalls', locale: msg.locale }));
				if (!(calls[0].calleeChannelID in this.bot.channelGuildMap)) {
					msg.channel.createMessage(this.i18n.__({ phrase: 'acceptCall.noLongerAvailable', locale: msg.locale }));
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
					this.r.table('calls').get(calls[0].id).run((error, call) => {
						if (error) return handleDatabaseError(error, msg);
						this.bot.calls.set(calls[0].caller, call[0]);
						const otherSide = this.bot.guilds.get(this.bot.channelGuildMap[calls[0].callerChannelID]).channels.get(calls[0].callerChannelID);
						msg.channel.createMessage(this.i18n.__({ phrase: 'acceptCall.selfAccepted', locale: msg.locale }, otherSide.name, otherSide.guild.name));
						otherSide.createMessage(this.i18n.__({ phrase: 'acceptCall.accepted', locale: msg.locale }, msg.channel.name, msg.channel.guild.name));
					});
				});
			});
		});
	}
}

module.exports = Call;