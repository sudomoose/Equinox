const snekfetch = require('snekfetch');
const BaseCommand = require('../Structure/BaseCommand');
const stripTrailingZero = require('../Util/stripTrailingZero');
const Logger = require('../Util/Logger');
const config = require('../config.json');
const DescriptionBuilder = require('../Structure/DescriptionBuilder');

class Weather extends BaseCommand {
	constructor(bot, r, metrics, i18n) {
		super({
			command: 'weather',
			aliases: [],
			description: 'Retrieves the weather information about a specific location.',
			category: 'Utility',
			usage: 'weather <location...>',
			hidden: false,
			guildOnly: false
		});
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.i18n = i18n;
	}

	execute(msg, args) {
		if (args.length < 1) return msg.channel.createMessage(':question:   **»**   You must provide a location.');
		snekfetch.get('https://api.openweathermap.org/data/2.5/weather?q=' + encodeURIComponent(args.join(' ')) + '&APPID=' + config.api_keys.openweathermap).then((result) => {
			msg.channel.createMessage({
				embed: {
					title: 'Weather',
					description: new DescriptionBuilder().addField('Location', result.body.name + ', ' + result.body.sys.country).addField('Temperature', stripTrailingZero((result.body.main.temp * (9/5)) - 459.67) + ' °F / ' + stripTrailingZero(result.body.main.temp - 273.15) + ' °C').addField('Min. Temperature', stripTrailingZero((result.body.main.temp_min * (9/5)) - 459.67) + ' °F / ' + stripTrailingZero(result.body.main.temp_min - 273.15) + ' °C').addField('Max. Temperature', stripTrailingZero((result.body.main.temp_max * (9/5)) - 459.67) + ' °F / ' + stripTrailingZero(result.body.main.temp_max - 273.15) + ' °C').addField('Pressure', stripTrailingZero(0.014 * result.body.main.pressure) + ' psi').addField('Humidity', result.body.main.humidity + '%').addField('Visibility', stripTrailingZero(result.body.visibility * 0.00062) + ' mi / ' + stripTrailingZero(result.body.visibility / 1000) + ' km').addField('Wind', stripTrailingZero(result.body.wind.speed * (25/11)) + ' mph / ' + stripTrailingZero(result.body.wind.speed * 3.6) + ' km/h').addField('Cloudiness', result.body.clouds.all + '%').build(),
					color: this.bot.embedColor,
					footer: {
						text: 'Information provided via Open Weather Map'
					}
				}
			});
		}).catch((error) => {
			if (error.statusCode === 404) return msg.channel.createMessage(':exclamation:   **»**   Unable to find any locations by that name.');
			msg.channel.createMessage(':exclamation:   **»**   Failed to run the command. This incident has been reported.');
			Logger.error('Failed to get the weather', error);
		});
	}
}

module.exports = Weather;