const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class Call extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'accept-call',
			aliases: [
				'acceptcall'
			],
			description: 'Accept your current incoming call.',
			category: 'Fun',
			usage: 'accept-call',
			hidden: false,
			guildOnly: true
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg) {
		this.r.table('registrations').get(msg.channel.id).run((error, registeration) => {
			if (error) return handleDatabaseError(error, msg);
			if (!registeration) return msg.channel.createMessage(this.i18n.__({ phrase: 'acceptCall.noAssignedNumber', locale: msg.locale }, msg.prefix));
			const calls = this.bot.calls.filter((call) => call.callee.id === msg.channel.id && !call.accepted);
			if (calls.length < 1) return msg.channel.createMessage(this.i18n.__({ phrase: 'acceptCall.noIncomingCalls', locale: msg.locale }));
			if (!(calls[0].calleeChannel.id in this.bot.channelGuildMap)) return calls[0].endCall().then(() => {
				msg.channel.createMessage(this.i18n.__({ phrase: 'acceptCall.noLongerAvailable', locale: msg.locale }));
				this.bot.calls.delete(calls[0].id);
			}).catch((error) => {
				handleDatabaseError(error, msg);
			});
			calls[0].acceptCall().then(() => {
				msg.channel.createMessage(this.i18n.__({ phrase: 'acceptCall.selfAccepted', locale: msg.locale }, calls[0].calleeChannel.name, calls[0].calleeChannel.guild.name));
				calls[0].callerChannel.createMessage(this.i18n.__({ phrase: 'acceptCall.accepted', locale: msg.locale }, msg.channel.name, msg.channel.guild.name));
			}).catch((error) => {
				handleDatabaseError(error, msg);
			});
		});
	}
}

module.exports = Call;