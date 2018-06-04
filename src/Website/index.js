const path = require('path');
const fs = require('fs');
const express = require('express');
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
		this.app.use((req, res, next) => {
			this.metrics.increment('website.views');
			this.metrics.increment('website.viewsByURL', 1, [ 'url:' + req.method + ' ' + req.url ]);
			next();
		});
		this.app.use(auth(this.r));
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