const Client = require('./Client');
const config = require('./config.json');

const bot = new Client(config.token, config.client_options);

bot.launch();