/* eslint no-console: off */

const dateformat = require('dateformat');
const util = require('util');

module.exports.info = (...msg) => {
	console.log(dateformat(Date.now(), 'mm/dd/yyyy hh:MM:ss TT') + ' | ' + msg.map((v) => typeof v === 'string' ? v : util.inspect(v)).join(' '));
};

module.exports.warn = (...msg) => {
	console.warn(dateformat(Date.now(), 'mm/dd/yyyy hh:MM:ss TT') + ' | ' + msg.map((v) => typeof v === 'string' ? v : util.inspect(v)).join(' '));
};

module.exports.error = (...msg) => {
	console.error(dateformat(Date.now(), 'mm/dd/yyyy hh:MM:ss TT') + ' | ' + msg.map((v) => typeof v === 'string' ? v : util.inspect(v)).join(' '));
};