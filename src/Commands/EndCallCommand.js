const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const formatPhoneNumber = require('../Util/formatPhoneNumber');

class EndCall extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'endcall',
			aliases: [
				'ecall',
				'declinecall'
			],
			description: 'Ends your current call.',
			category: 'Fun',
			usage: 'endcall',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
		this.r.table('registrations').get(msg.channel.id).run((error, registeration) => {
			if (error) return handleDatabaseError(error, msg);
			if (!registeration) return msg.channel.createMessage(':exclamation:   **»**   This channel does not have an assigned phone number. Use `' + msg.prefix + 'register` to get one.');
			this.r.table('calls').filter(this.r.row('caller').eq(registeration.number).or(this.r.row('callee').eq(registeration.number))).run((error, calls) => {
				if (error) return handleDatabaseError(error, msg);
				if (calls.length < 1) return msg.channel.createMessage(':exclamation:   **»**   You are not in any calls in this channel.');
				this.r.table('calls').get(calls[0].id).delete().run((error) => {
					if (error) return handleDatabaseError(error, msg);
					this.bot.calls.delete(calls[0].caller);
					const otherSide = this.bot.guilds.get(this.bot.channelGuildMap[registeration.number === calls[0].caller ? calls[0].calleeChannelID : calls[0].callerChannelID]).channels.get(registeration.number === calls[0].caller ? calls[0].calleeChannelID : calls[0].callerChannelID);
					msg.channel.createMessage(':telephone:   **»**   You have ended the current call. To call back, use `' + msg.prefix + 'call ' + formatPhoneNumber(registeration.number === calls[0].caller ? calls[0].callee : calls[0].caller) + '`.');
					otherSide.createMessage(':telephone:   **»**   The other side has ended the call. To call back, use `' + msg.prefix + 'call ' + formatPhoneNumber(registeration.number === calls[0].caller ? calls[0].caller : calls[0].callee) + '`.');
				});
			});
		});
	}
}

module.exports = EndCall;