const convert = require('convert-units');
const BaseCommand = require('../Structure/BaseCommand');
const DescriptionBuilder = require('../Structure/DescriptionBuilder');

const emotes = {
	length: ':straight_ruler:',
	area: ':map:',
	mass: ':scales:',
	volume: ':house:',
	each: ':four_leaf_clover:',
	temperature: ':hot_pepper:',
	time: ':alarm_clock:',
	digital: ':floppy_disk:',
	partsPer: ':oil:',
	speed: ':race_car:',
	pace: ':runner:',
	pressure: ':ocean:',
	current: ':zap:',
	voltage: ':zap:',
	power: ':zap:',
	reactivePower: ':zap:',
	apparentPower: ':zap:',
	energy: ':zap:',
	reactiveEnergy: ':zap:',
	volumeFlowRate: ':water_polo:',
	illuminance: ':flashlight:',
	frequency: ':loudspeaker:'
};

const rename = {
	length: 'Length',
	area: 'Area',
	mass: 'Mass',
	volume: 'Volume',
	each: 'Each',
	temperature: 'Temperature',
	time: 'Time',
	digital: 'Digital',
	partsPer: 'Parts Per',
	speed: 'Speed',
	pace: 'Pace',
	pressure: 'Pressure',
	current: 'Current',
	voltage: 'Voltage',
	power: 'Power',
	reactivePower: 'Reactive Power',
	apparentPower: 'Apparent Power',
	energy: 'Energy',
	reactiveEnergy: 'Reactive Energy',
	volumeFlowRate: 'Volume Flow Rate',
	illuminance: 'Illuminance',
	frequency: 'Frequency',
	angle: 'Angle'
};

class Convert extends BaseCommand {
	constructor(bot, r, metrics, i18n, secondaryDB) {
		super({
			command: 'convert',
			aliases: [
				'conv'
			],
			description: 'Convert basic units with amounts.',
			category: 'Utility',
			usage: 'convert [<amount>] [<unit from>] [<unit to>]',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
		this.secondaryDB = secondaryDB;
	}

	execute(msg, args) {
		if (args.length > 0) {
			if (isNaN(args[0])) return msg.channel.createMessage(':exclamation:   **»**   The amount must be a valid number.');
			if (args.length < 2) return msg.channel.createMessage(':question:   **»**   You must provide a unit to convert from.');
			if (args.length < 3) return msg.channel.createMessage(':question:   **»**   You must provide a unit to convert to.');
			if (!convert().possibilities().includes(args[1])) return msg.channel.createMessage(':exclamation:   **»**   `' + args[1] + '` is not a unit I know of. Make sure you spelled it right, and that it\'s capitalized correctly.');
			if (!convert().from(args[1]).possibilities().includes(args[2])) return msg.channel.createMessage(':exclamation:   **»**   `' + args[2] + '` is not a unit I know of, or cannot be converted to from `' + args[1] + '`. Make sure you spelled it right, and that it\'s capitalized correctly.');
			const output = convert(Number(args[0])).from(args[1]).to(args[2]);
			const from = convert().describe(args[1]);
			const to = convert().describe(args[2]);
			msg.channel.createMessage(':scales:   **»**   ' + args[0] + ' ' + (Number(args[0]) === 1 ? from.singular : from.plural).toLowerCase() + ' is approximately `' + output + '` ' + (output === 1 ? to.singular : to.plural).toLowerCase() + '.');
		} else {
			msg.channel.createMessage({
				embed: {
					title: 'Conversion Cheat Sheet',
					color: this.bot.embedColor,
					description: new DescriptionBuilder().addFields(convert().measures().map((unit) => [emotes[unit], rename[unit], convert().possibilities(unit).map((unit) => '`' + unit + '`').join(', ')])).build()
				}
			});
		}
	}
}

module.exports = Convert;