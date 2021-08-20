const { Servers } = require('../bootstrap/database');
const { getGuild } = require('./discord');

async function ensureSettings(guildID) {
	return await Servers.create({ id: guildID });
}

async function getSettings(guildID) {
	await ensureSettings(guildID);
	return Servers.findOne({ where: { id: guildID } });
}

async function getChannel(guildID, key) {
	const channelID = await Servers.findOne({ where: { id: guildID } })[key];
	return getGuild(guildID).channels.cache.get(channelID);
}

function getMessage(guildID, key) {
	return Servers.findOne({ where: { id: guildID } })[key];
}

function getRole(guildID, key) {
	const roleID = Servers.findOne({ where: { id: guildID } })[key];
	return getGuild(guildID).roles.cache.get(roleID)[key];
}

module.exports = { ensureSettings, getSettings, getChannel, getMessage, getRole };
