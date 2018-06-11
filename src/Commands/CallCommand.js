/* eslint-disable no-unreachable */

const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const formatPhoneNumber = require('../Util/formatPhoneNumber');
const CallHandler = require('../Structure/Call');

class Call extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'call',
			aliases: [],
			description: 'Call a specific channel using their phone number.',
			category: 'Fun',
			usage: 'call <phone number...>|random',
			hidden: false,
			guildOnly: true
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		// return msg.channel.createMessage(':no_entry_sign:   **»**   Calling has been temporarily disabled until the call rewrite.');
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a phone number, or `random`.');
		this.r.table('registrations').get(msg.channel.id).run((error, registeration) => {
			if (error) return handleDatabaseError(error, msg);
			if (!registeration) return msg.channel.createMessage(':exclamation:   **»**   This channel does not have an assigned phone number. Use `' + msg.prefix + 'register` to get one.');
			const call = (register) => {
				if (!(register.id in this.bot.channelGuildMap)) return msg.channel.createMessage(':exclamation:   **»**   That phone number exists, but the channel has been deleted.');
				if (register.id === registeration.id) return msg.channel.createMessage(':exclamation:   **»**   You can\'t call yourself, silly!');
				const calls = this.bot.calls.filter((call) => call.isCall(msg));
				if (calls.length > 0) return msg.channel.createMessage(':exclamation:   **»**   That channel is already in another call with a different channel.');
				const calleeChannel = this.bot.guilds.get(this.bot.channelGuildMap[register.id]).channels.get(register.id);
				this.r.table('calls').insert({
					callerChannelID: msg.channel.id,
					caller: registeration,
					calleeChannelID: register.id,
					callee: register,
					timestamp: Date.now(),
					accepted: false
				}, { returnChanges: true }).run((error, results) => {
					if (error) return handleDatabaseError(error, msg);
					this.bot.calls.set(results.changes[0].new_val.id, new CallHandler(this.r, {
						...results.changes[0].new_val,
						callerChannel: msg.channel,
						calleeChannel
					}));
					msg.channel.createMessage(':telephone:   **»**   Calling `' + formatPhoneNumber(register.number) + '`... They have 30 seconds to accept it. You can use `' + msg.prefix + 'end-call` to end the call.');
					this.bot.guilds.get(this.bot.channelGuildMap[register.id]).channels.get(register.id).createMessage(':telephone:   **»**   You are receiving a call from `' + formatPhoneNumber(registeration.number) + '`. Use `' + msg.prefix + 'accept-call` to accept it, and `' + msg.prefix + 'decline-call` to decline it.');
					setTimeout(() => {
						const call = this.bot.calls.get(results.changes[0].new_val.id);
						if (!call || call.accepted) return;
						call.endCall().then(() => {
							this.bot.calls.delete(call.id);
							msg.channel.createMessage(':telephone:   **»**   `' + formatPhoneNumber(register.number) + '` did not pick up in time.');
							calleeChannel.createMessage(':telephone:   **»**   You missed a call from `' + formatPhoneNumber(registeration.number) + '`.');
						}).catch((error) => {
							handleDatabaseError(error, msg);
						});
					}, 30000);
				});
			};
			if (args[0].toLowerCase() === 'random') {
				this.r.table('registrations').sample(1).run((error, register) => {
					if (error) return handleDatabaseError(error, msg);
					if (register.length < 1) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any channels to call.');
					call(register[0]);
				});
			} else {
				const number = args.join(' ').replace(/[^0-9]/g, '');
				if (isNaN(number)) return msg.channel.createMessage(':exclamation:   **»**   The phone number must be a valid number.');
				this.r.table('registrations').filter({ number: Number(number) }).run((error, register) => {
					if (error) return handleDatabaseError(error, msg);
					if (register.length < 1) return msg.channel.createMessage(':exclamation:   **»**   That phone number does not exist.');
					call(register[0]);
				});
			}
		});
	}
}

module.exports = Call;