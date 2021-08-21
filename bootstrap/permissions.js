const { getGuild } = require('../helpers/discord');

async function permissionsForGuild(guildId) {
	const guild = getGuild(guildId);
	const commands = await guild.commands.fetch();

	const fullPermissions = [];
	commands.each(async command => {
		fullPermissions.push({
			id: command.id,
			permissions: [{
				id: guild.ownerId,
				type: 'USER',
				permission: true,
			}],
		});
	});
	await guild?.commands.permissions.set({ fullPermissions });

}

module.exports = { permissionsForGuild };