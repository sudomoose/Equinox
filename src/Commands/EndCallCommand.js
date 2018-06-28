const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const formatPhoneNumber = require('../Util/formatPhoneNumber');

class EndCall extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'end-call',
			aliases: [
				'endcall',
				'decline-call',
				'declinecall'
			],
			description: 'Ends your current call.',
			category: 'Fun',
			usage: 'end-call',
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
		this.r.table('registrations').get(msg.channel.id).run((error, registeration) => {
			if (error) return handleDatabaseError(error, msg);
			if (!registeration) return msg.channel.createMessage(':exclamation:   **»**   This channel does not have an assigned phone number. Use `' + msg.prefix + 'register` to get one.');
			const calls = this.bot.calls.filter((call) => call.isCall(msg));
			if (calls.length < 1) return msg.channel.createMessage(':exclamation:   **»**   You are not in any calls in this channel.');
			calls[0].endCall().then(() => {
				const otherSide = msg.channel.id === calls[0].caller.id ? calls[0].calleeChannel : calls[0].callerChannel;
				msg.channel.createMessage(':telephone:   **»**   You have ended the current call. To call back, use `' + msg.prefix + 'call ' + formatPhoneNumber(msg.channel.id === calls[0].caller.id ? calls[0].callee.number : calls[0].caller.number) + '`.');
				otherSide.createMessage(':telephone:   **»**   The other side has ended the call. To call back, use `' + msg.prefix + 'call ' + formatPhoneNumber(msg.channel.id === calls[0].caller.id ? calls[0].caller.number : calls[0].callee.number) + '`.');
				this.bot.calls.delete(calls[0].caller);
			}).catch((error) => {
				handleDatabaseError(error, msg);
			});
		});
	}
}

module.exports = EndCall;