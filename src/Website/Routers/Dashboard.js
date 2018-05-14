const express = require('express');
const Logger = require('../../Util/Logger');
const updateSettings = require('../../Util/updateSettings');

class Dashboard {
	constructor(bot, r, metrics) {
		this.bot = bot;
		this.r = r;
		this.metrics = metrics;
		this.route = '/dashboard';
		this.router = express.Router();
		this.setupRoutes();
	}

	setupRoutes() {
		this.router.get('/', this.auth, (req, res) => {
			res.render('dashboard.pug');
		});
		
		this.router.get('/:id', this.auth, this.serverAuth.bind(this), (req, res) => {
			const guild = this.bot.guilds.get(req.params.id);
			this.r.table('settings').get(guild.id).run((error, settings) => {
				if (error) {
					Logger.error(error);
					res.status(500).render('error.pug', {
						code: 500,
						message: 'An error occured while trying to get guild settings. Please try again later.'
					});
					return;
				}
				res.render('server.pug', {
					guild,
					settings
				});
			});
		});
		
		this.router.post('/:id', this.auth, this.serverAuth.bind(this), (req, res) => {
			const guild = this.bot.guilds.get(req.params.id);
			updateSettings(this.r, guild.id, {
				autoSnipe: req.body.autoSnipe === 'true',
				joinMessages: {
					enabled: req.body['joinMessages.enabled'] === 'true',
					channelID: req.body['joinMessages.channelID'],
					message: req.body['joinMessages.message']
				},
				leaveMessages: {
					enabled: req.body['leaveMessages.enabled'] === 'true',
					channelID: req.body['leaveMessages.channelID'],
					message: req.body['leaveMessages.message']
				}
			}).then(() => {
				res.redirect('/dashboard/' + req.params.id);
			}).catch((error) => {
				Logger.error(error);
				res.status(500).render('error.pug', {
					code: 500,
					message: 'An error occured while trying to update guild settings. Please try again later.'
				});
			});
		});
	}

	getRouter() {
		return this.router;
	}

	auth(req, res, next) {
		if (!req.user) return res.redirect('/auth');
		next();
	}

	serverAuth(req, res, next) {
		const guild = this.bot.guilds.get(req.params.id);
		if (!guild) return res.redirect('/invite/' + req.params.id);
		if (!guild.members.has(req.user.id)) return res.status(403).render('error.pug', {
			code: 403,
			message: 'You\'re not a member of that server.'
		});
		const member = guild.members.get(req.user.id);
		if (!member.permission.has('manageGuild')) return res.status(403).render('error.pug', {
			code: 403,
			message: 'You do not have permission to change these settings. You must have Manage Server permissions.'
		});
		next();
	}
}

module.exports = Dashboard;