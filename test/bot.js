const Client = require('../src/Client');

const bot = new Client(process.env.TEST_TOKEN, {});

bot.bot.on('ready', () => {
	if (bot.user.id !== '434843046304022528') return process.exit(1);
	process.exit(0);
});

bot.bot.on('disconnect', () => {
	process.exit(1);
});

bot.launch();