const snekfetch = require('snekfetch');
const BaseCommand = require('../Structure/BaseCommand');
const stripTrailingZero = require('../Util/stripTrailingZero');
const Logger = require('../Util/Logger');
let config;
if (!('TEST_TOKEN' in process.env)) config = require('../config.json');

class Weather extends BaseCommand {
	constructor(bot, r) {
		super({
			command: 'weather',
			aliases: [],
			description: 'Retrieves the weather information about a specific location.',
			category: 'Utility',
			usage: 'weather <location...>',
			hidden: false
		});
		this.bot = bot;
		this.r = r;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a location.');
		snekfetch.get('https://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(args.join(' ')) + '&APPID=' + config.api_keys.openweathermap).then((result) => {
			msg.channel.createMessage({
				embed: {
					title: 'Weather',
					description: result.body.name + ', ' + result.body.sys.country,
					color: this.bot.embedColor,
					fields: [
						{
							name: 'Summary',
							value: result.body.weather[0].main,
							inline: true
						},
						{
							name: 'Temperature',
							value: stripTrailingZero((result.body.main.temp * (9/5)) - 459.67) + ' °F / ' + stripTrailingZero(result.body.main.temp - 273.15) + ' °C',
							inline: true
						},
						{
							name: 'Min Temperature',
							value: stripTrailingZero((result.body.main.temp_min * (9/5)) - 459.67) + ' °F / ' + stripTrailingZero(result.body.main.temp_min - 273.15) + ' °C',
							inline: true
						},
						{
							name: 'Max Temperature',
							value: stripTrailingZero((result.body.main.temp_max * (9/5)) - 459.67) + ' °F / ' + stripTrailingZero(result.body.main.temp_max - 273.15) + ' °C',
							inline: true
						},
						{
							name: 'Pressure',
							value: stripTrailingZero(0.014 * result.body.main.pressure) + ' psi',
							inline: true
						},
						{
							name: 'Humidity',
							value: result.body.main.humidity + '%',
							inline: true
						},
						{
							name: 'Visibility',
							value: stripTrailingZero(result.body.visibility * 0.00062) + ' mi / ' + stripTrailingZero(result.body.visibility / 1000) + ' km',
							inline: true
						},
						{
							name: 'Wind',
							value: stripTrailingZero(result.body.wind.speed * (25/11)) + ' mph / ' + stripTrailingZero(result.body.wind.speed * 3.6) + ' km/h',
							inline: true
						},
						{
							name: 'Cloudiness',
							value: result.body.clouds.all + '%',
							inline: true
						}
					],
					footer: {
						text: 'Information provided via Open Weather Map'
					}
				}
			});
		}).catch((error) => {
			if (error.status === 404) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any locations by that name.');
			msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
			Logger.error('Failed to get the weather', error);
		});
	}
}

module.exports = Weather;