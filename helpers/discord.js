const { client } = require('..');

function getGuild(guildId) {
	return client.guilds.cache.get(guildId);
}

function getChannel(channelId) {
	return client.channels.cache.get(channelId);
}

function getRole(guildId, roleId) {
	return client.guilds.cache.get(guildId).roles.cache.get(roleId);
}

function getMember(guildId, memberId) {
	return client.guilds.cache.get(guildId).members.cache.get(memberId);
}

module.exports = { getGuild, getChannel, getMember, getRole };