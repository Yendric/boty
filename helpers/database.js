const Servers = require('../models/Servers');
const Users = require('../models/Users');

async function ensureSettings(guildId) {
	let server = await Servers.findOne({ where: { guild_id: guildId } });
	if(!server) {
		server = await Servers.create({
			guild_id: guildId,
		});
	}
	return server;
}

async function deleteSettings(guildId) {
	await Servers.destroy({ where: { guild_id:guildId } });
}

async function getSettings(guildId) {
	return await ensureSettings(guildId);
}

async function ensureUser(snowflake) {
	let user = await Users.findOne({ where: { snowflake } });
	if(!user) {
		user = await Users.create({
			snowflake,
		});
	}
	return user;
}

async function getUser(snowflake) {
	return await ensureUser(snowflake);
}

module.exports = { ensureSettings, getSettings, deleteSettings, ensureUser, getUser };