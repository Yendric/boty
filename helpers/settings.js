const Servers = require('../bootstrap/initDB');
const client = require('../index');

async function ensureSettings(guildID) {
	return await Servers.create({ id: guildID });
}

function getSettings(guildID) {
	await ensureSettings(guildID);
	return Servers.findOne({ where: { id: guildID } });
}

async function getChannel(guildID, key) {
	const channelID = await Servers.findOne({ where: { id: guildID } })[key];
	return client.guilds.cache.get(guildID).channels.cache.get(channelID);
}

function getMessage(guildID, key) {
	return Servers.findOne({ where: { id: guildID } })[key];
}

function getRole(guildID, key) {
	const roleID = Servers.findOne({ where: { id: guildID } })[key];
	return client.guilds.cache.get(guildID).roles.cache.get(roleID)[key];
}

module.exports = { ensureSettings, getSettings, getChannel, getMessage, getRole };
