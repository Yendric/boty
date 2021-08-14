module.exports = (client) => {
	console.log(`${client.user.username} is online op ${client.guilds.cache.size} server(s)!`);
	client.user.setActivity('jou', { type: 'WATCHING' });
};