const express = require('express');
const passport = require('passport');
const Discord = require('passport-discord');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
const config = require('../config.json');
const Logger = require('../Util/Logger');

const router = express.Router();

module.exports = (r) => {
	passport.use(new Discord.Strategy({ passReqToCallback: true, ...config.website.discord }, (req, accessToken, refreshToken, profile, done) => {
		profile.lastGuildUpdate = Date.now();
		r.table('users').insert(profile, { conflict: 'replace' }).run((error) => {
			if (error) {
				Logger.error(error);
				req.res.status(500).render('error.pug', {
					code: 500,
					message: 'An error occured while trying to log you in. Please try again later.'
				});
				return done(error, null);
			}
			done(null, profile);
		});
	}));
	passport.serializeUser((user, done) => done(null, user));
	passport.deserializeUser((user, done) => done(null, user));

	router.use(bodyParser.json());
	router.use(bodyParser.urlencoded({
		extended: true
	}));
	router.use(cookieParser(config.website.secret));
	router.use(cookieSession({
		secret: config.website.secret,
		maxAge: 1000 * 60 * 60 * 24 * 365
	}));
	router.use(passport.initialize());
	router.use(passport.session());
	router.use((req, res, next) => {
		res.locals.user = req.user;
		next();
	});

	router.get('/auth', passport.authenticate('discord'));

	router.get('/auth/callback', passport.authenticate('discord', {
		successRedirect: '/dashboard'
	}));

	router.get('/auth/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	return router;
};