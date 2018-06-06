module.exports = (bot) => {
	bot.on('messageCreate', (msg) => {
		let index = -1;
		const next = () => {
			index++;
			if (bot.messageHandlers.length === index) return;
			bot.messageHandlers[index].execute(msg, next);
		};
		next();
	});
};