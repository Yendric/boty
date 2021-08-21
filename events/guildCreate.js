const { slashCommandsForGuild } = require('../bootstrap/commands');
const { ensureSettings } = require('../helpers/database');

module.exports = {
	name: 'guildCreate',
	async execute(guild) {
		console.info('Guild gejoined: ' + guild.name);
		ensureSettings(guild.id);
		slashCommandsForGuild(guild.id);
	},
};