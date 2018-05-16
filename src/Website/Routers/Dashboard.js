const express = require('express');
const humanizeDuration = require('humanize-duration');
const snekfetch = require('snekfetch');
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
		this.router.get('/', this.auth, this.getDevelopers.bind(this), (req, res) => {
			res.render('dashboard.pug', {
				botGuilds: Array.from(this.bot.guilds.keys())
			});
		});

		this.router.get('/refresh', this.auth, (req, res) => {
			if (Date.now() - req.user.lastGuildUpdate <= (1000 * 60 * 5)) return res.status(429).render('error.pug', {
				code: 429,
				message: 'You\'re using this feature too fast. Try again in ' + humanizeDuration((1000 * 60 * 5) - (Date.now() - req.user.lastGuildUpdate), { round: true }) + '.'
			});
			snekfetch.get('https://discordapp.com/api/users/@me/guilds').set('Authorization', 'Bearer ' + req.user.accessToken).then((guilds) => {
				this.r.table('users').get(req.user.id).update({ guilds: Array.from(guilds.body) }).run((error) => {
					if (error) Logger.error(error);
				});
				req.user.guilds = Array.from(guilds.body);
				req.user.lastGuildUpdate = Date.now();
				res.redirect('/dashboard');
			}).catch((error) => {
				res.status(500).render('error.pug', {
					code: 500,
					message: 'An error occured while trying to fetch new guilds. Please try again later.'
				});
				Logger.error(error);
			});
		});
		
		this.router.get('/:id', this.auth, this.getDevelopers.bind(this), this.serverAuth.bind(this), (req, res) => {
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
		
		this.router.post('/:id', this.auth, this.getDevelopers.bind(this), this.serverAuth.bind(this), (req, res) => {
			const guild = this.bot.guilds.get(req.params.id);
			if (
				(req.body.autoSnipe !== 'true' && req.body.autoSnipe !== 'false') ||
				(req.body['joinMessages.enabled'] !== 'true' && req.body['joinMessages.enabled'] !== 'false') ||
				(req.body['leaveMessages.enabled'] !== 'true' && req.body['leaveMessages.enabled'] !== 'false')
			) return res.status(400).render('error.pug', {
				code: 400,
				message: 'Invalid form body.'
			});
			if (!guild.channels.has(req.body['joinMessages.channelID'])) return res.status(400).render('error.pug', {
				code: 400,
				message: 'That channel does not exist for the join message.'
			});
			if (!guild.channels.has(req.body['leaveMessages.channelID'])) return res.status(400).render('error.pug', {
				code: 400,
				message: 'That channel does not exist for the leave message.'
			});
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
		if (!res.locals.developers.includes(req.user.id) && !member.permission.has('manageGuild')) return res.status(403).render('error.pug', {
			code: 403,
			message: 'You do not have permission to change these settings. You must have Manage Server permissions.'
		});
		next();
	}

	getDevelopers(req, res, next) {
		this.r.table('developers')('id').run((error, developers) => {
			if (error) {
				Logger.error(error);
				res.status(500).render('error.pug', {
					code: 500,
					message: 'An error occured while trying to update guild settings. Please try again later.'
				});
				return;
			}
			res.locals.developers = developers;
			next();
		});
	}
}

module.exports = Dashboard;