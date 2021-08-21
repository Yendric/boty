const { getSettings } = require('../helpers/database');
const { getGuild, getRole } = require('../helpers/discord');

async function permissionsForGuild(guildId) {
	const guild = getGuild(guildId);
	const settings = await getSettings(guildId);
	const commands = await guild.commands.fetch();

	const fullPermissions = [];
	let rolePermissions;
	if(settings.admin_role && getRole(guildId, settings.admin_role)) {
		rolePermissions = {
			id: getRole(guildId, settings.admin_role).id,
			type: 'ROLE',
			permission: true,
		};
	}

	commands.each(async command => {
		const permissions = {
			id: command.id,
			permissions: [{
				id: guild.ownerId,
				type: 'USER',
				permission: true,
			}],
		};
		if(rolePermissions) permissions.permissions = [...permissions.permissions, rolePermissions];
		fullPermissions.push(permissions);

	});
	await guild?.commands.permissions.set({ fullPermissions });

}

module.exports = { permissionsForGuild };