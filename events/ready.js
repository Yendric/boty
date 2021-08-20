module.exports = (client) => {
	console.info(`${client.user.username} is online op ${client.guilds.cache.size} server(s)!`);
	client.user.setActivity('jou', { type: 'WATCHING' });
};