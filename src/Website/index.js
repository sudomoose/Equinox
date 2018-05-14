const path = require('path');
const fs = require('fs');
const express = require('express');
const snekfetch = require('snekfetch');
const auth = require('./auth');
const config = require('../config.json');
const Logger = require('../Util/Logger');

class Website {
	constructor(bot, r, metrics) {
		this.app = express();
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.setup();
		this.loadRouters();
	}

	setup() {
		this.app.set('view engine', 'pug');
		this.app.set('views', path.join(__dirname, 'dynamic'));
		this.app.use(auth(this.r));
		this.app.use((req, res, next) => {
			if (!req.user || Date.now() - req.user.lastGuildUpdate < 1000 * 60 * 60 * 24) return next();
			snekfetch.get('https://discordapp.com/api/users/@me/guilds').set('Authorization', 'Bearer ' + req.user.accessToken).then((guilds) => {
				this.r.table('users').get(req.user.id).update({ guilds: Array.from(guilds.body) }).run((error) => {
					if (error) Logger.error(error);
				});
				req.user.guilds = Array.from(guilds.body);
				req.user.lastGuildUpdate = Date.now();
				next();
			}).catch((error) => {
				res.status(500).render('error.pug', {
					code: 500,
					message: 'An error occured while trying to fetch new guilds. Please try again later.'
				});
				Logger.error(error);
			});
		});
	}

	loadRouters() {
		fs.readdir(path.join(__dirname, 'Routers'), (error, routers) => {
			for (let i = 0; i < routers.length; i++) {
				const Router = require(path.join(__dirname, 'Routers', routers[i]));
				const route = new Router(this.bot, this.r, this.metrics);
				this.app.use(route.route, route.getRouter());

				if ((i + 1) === routers.length) {
					this.app.use(express.static(path.join(__dirname, 'static')));
					this.app.use((req, res) => {
						res.status(404).render('error.pug', {
							code: 404,
							message: 'No page or file was found by that URL.'
						});
					});
				}
			}
		});
	}

	launch() {
		this.app.listen(config.website.port, () => {
			Logger.info('Website listening on port ' + config.website.port + '.');
		});
	}
}

module.exports = Website;