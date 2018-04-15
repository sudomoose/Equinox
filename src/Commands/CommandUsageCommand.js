const BaseCommand = require('../Structure/BaseCommand');
const handleDatabaseError = require('../Util/handleDatabaseError');

class CommandUsage extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'commandusage',
			aliases: [
				'command-usage',
				'usage'
			],
			description: 'Gets the usage of commands.',
			category: 'Utility',
			usage: 'commandusage',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg) {
		let start = Date.now();
		const data = {
			hour: {},
			day: {},
			week: {},
			total: {}
		};
		this.r.table('commands').filter(this.r.row('timestamp').gt(Date.now() - (1000 * 60 * 60)))('command').run((error, lastHour) => {
			if (error) return handleDatabaseError(error, msg);
			for (let i = 0; i < lastHour.length; i++) {
				if (!(lastHour[i] in data.hour)) data.hour[lastHour[i]] = 0;
				data.hour[lastHour[i]]++;
			}
			this.r.table('commands').filter(this.r.row('timestamp').gt(Date.now() - (1000 * 60 * 60 * 24)))('command').run((error, lastDay) => {
				if (error) return handleDatabaseError(error, msg);
				for (let i = 0; i < lastDay.length; i++) {
					if (!(lastDay[i] in data.day)) data.day[lastDay[i]] = 0;
					data.day[lastDay[i]]++;
				}
				this.r.table('commands').filter(this.r.row('timestamp').gt(Date.now() - (1000 * 60 * 60 * 24 * 7)))('command').run((error, lastWeek) => {
					if (error) return handleDatabaseError(error, msg);
					for (let i = 0; i < lastWeek.length; i++) {
						if (!(lastWeek[i] in data.week)) data.week[lastWeek[i]] = 0;
						data.week[lastWeek[i]]++;
					}
					this.r.table('commands')('command').run((error, total) => {
						if (error) return handleDatabaseError(error, msg);
						for (let i = 0; i < total.length; i++) {
							if (!(total[i] in data.total)) data.total[total[i]] = 0;
							data.total[total[i]]++;
						}
						msg.channel.createMessage({
							embed: {
								title: 'Command Usage',
								color: this.bot.embedColor,
								description: 'Total commands used: ' + total.length, 
								fields: [
									{
										name: 'Last Hour',
										value: Object.keys(data.hour).sort((a, b) => {
											if (data.hour[a] < data.hour[b]) return 1;
											if (data.hour[a] > data.hour[b]) return -1;
											return 0;
										}).map((command) => '`[' + Array(Math.round(data.hour[command] / Object.values(data.hour).reduce((a, b) => a + b, 0) * 10)).fill('█').join('') + Array(10 - Math.round(data.hour[command] / Object.values(data.hour).reduce((a, b) => a + b, 0) * 10)).fill(' ').join('') + ']` - ' + command + ' (' + ((data.hour[command] / Object.values(data.hour).reduce((a, b) => a + b, 0)) * 100).toFixed(1) + '%, ' + data.hour[command] + ')').join('\n'),
										inline: false
									},
									{
										name: 'Last Day',
										value: Object.keys(data.day).sort((a, b) => {
											if (data.day[a] < data.day[b]) return 1;
											if (data.day[a] > data.day[b]) return -1;
											return 0;
										}).map((command) => '`[' + Array(Math.round(data.day[command] / Object.values(data.day).reduce((a, b) => a + b, 0) * 10)).fill('█').join('') + Array(10 - Math.round(data.day[command] / Object.values(data.day).reduce((a, b) => a + b, 0) * 10)).fill(' ').join('') + ']` - ' + command + ' (' + ((data.day[command] / Object.values(data.day).reduce((a, b) => a + b, 0)) * 100).toFixed(1) + '%, ' + data.day[command] + ')').join('\n'),
										inline: false
									},
									{
										name: 'Last Week',
										value: Object.keys(data.week).sort((a, b) => {
											if (data.week[a] < data.week[b]) return 1;
											if (data.week[a] > data.week[b]) return -1;
											return 0;
										}).map((command) => '`[' + Array(Math.round(data.week[command] / Object.values(data.week).reduce((a, b) => a + b, 0) * 10)).fill('█').join('') + Array(10 - Math.round(data.week[command] / Object.values(data.week).reduce((a, b) => a + b, 0) * 10)).fill(' ').join('') + ']` - ' + command + ' (' + ((data.week[command] / Object.values(data.week).reduce((a, b) => a + b, 0)) * 100).toFixed(1) + '%, ' + data.week[command] + ')').join('\n'),
										inline: false
									},
									{
										name: 'Total',
										value: Object.keys(data.total).sort((a, b) => {
											if (data.total[a] < data.total[b]) return 1;
											if (data.total[a] > data.total[b]) return -1;
											return 0;
										}).map((command) => '`[' + Array(Math.round(data.total[command] / Object.values(data.total).reduce((a, b) => a + b, 0) * 10)).fill('█').join('') + Array(10 - Math.round(data.total[command] / Object.values(data.total).reduce((a, b) => a + b, 0) * 10)).fill(' ').join('') + ']` - ' + command + ' (' + ((data.total[command] / Object.values(data.total).reduce((a, b) => a + b, 0)) * 100).toFixed(1) + '%, ' + data.total[command] + ')').join('\n'),
										inline: false
									}
								]
							}
						});
					});
				});
			});
		});
	}
}

module.exports = CommandUsage;