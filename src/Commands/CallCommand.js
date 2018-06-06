const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');
const formatPhoneNumber = require('../Util/formatPhoneNumber');

class Call extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'call',
			aliases: [],
			description: 'Call a specific channel using their phone number.',
			category: 'Fun',
			usage: 'call <phone number...>|random',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (!msg.channel.guild) return msg.channel.createMessage(':no_entry_sign:   **»**   This command cannot be used in a direct message.');
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a phone number, or `random`.');
		this.r.table('registrations').get(msg.channel.id).run((error, registeration) => {
			if (error) return handleDatabaseError(error, msg);
			if (!registeration) return msg.channel.createMessage(':exclamation:   **»**   This channel does not have an assigned phone number. Use `' + msg.prefix + 'register` to get one.');
			const call = (register) => {
				if (!(register.id in this.bot.channelGuildMap)) return msg.channel.createMessage(':exclamation:   **»**   That phone number exists, but the channel has been deleted. Please try again.');
				if (register.id === registeration.id) return msg.channel.createMessage(':exclamation:   **»**   You can\'t call yourself, silly!');
				this.r.table('calls').filter(this.r.row('caller').eq(register.number).or(this.r.row('callee').eq(register.number))).run((error, calls) => {
					if (error) return handleDatabaseError(error, msg);
					if (calls.length > 0) return msg.channel.createMessage(':exclamation:   **»**   That channel is already in another call with a different channel.');
					this.r.table('calls').insert({
						callerChannelID: msg.channel.id,
						caller: registeration.number,
						calleeChannelID: register.id,
						callee: register.number,
						timestamp: Date.now(),
						accepted: false
					}).run((error) => {
						if (error) return handleDatabaseError(error, msg);
						this.bot.calls.set(registeration.number, {
							callerChannelID: msg.channel.id,
							caller: registeration.number,
							calleeChannelID: register.id,
							callee: register.number,
							timestamp: Date.now(),
							accepted: false
						});
						msg.channel.createMessage(':telephone:   **»**   Calling `' + formatPhoneNumber(register.number) + '`... They have 30 seconds to accept it. You can use `' + msg.prefix + 'endcall` to end the call.');
						this.bot.guilds.get(this.bot.channelGuildMap[register.id]).channels.get(register.id).createMessage(':telephone:   **»**   You are receiving a call from `' + formatPhoneNumber(registeration.number) + '`. Use `' + msg.prefix + 'acceptcall` to accept it, and `' + msg.prefix + 'declinecall` to decline it.');
						setTimeout(() => {
							this.r.table('calls').filter({ caller: registeration.number, callee: register.number }).run((error, call) => {
								if (error) return handleDatabaseError(error, msg);
								if (call.length < 1 || call[0].accepted) return;
								this.r.table('calls').get(call[0].id).delete().run((error) => {
									if (error) return handleDatabaseError(error, msg);
									this.bot.calls.delete(registeration.number);
									msg.channel.createMessage(':telephone:   **»**   `' + formatPhoneNumber(register.number) + '` did not pick up in time.');
									if (register.id in this.bot.channelGuildMap) this.bot.guilds.get(this.bot.channelGuildMap[register.id]).channels.get(register.id).createMessage(':telephone:   **»**   You missed a call from `' + formatPhoneNumber(registeration.number) + '`.');
								});
							});
						}, 30000);
					});
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