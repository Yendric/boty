module.exports = (client, guild) => {
	client.storage.settings.delete(guild.id);
};

