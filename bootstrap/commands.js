const { client } = require('..');
const { Collection } = require('discord.js');
const { getFiles } = require('../helpers/files');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { permissionsForGuild } = require('./permissions');

const commands = new Collection();
const commandFiles = getFiles('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	commands.set(command.data.name, command);
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

client.guilds.cache.each(async guild => {
	await slashCommandsForGuild(guild.id);
});

async function slashCommandsForGuild(guildId) {
	try {
		console.info('Slash commands initialiseren voor: ' + guildId);
		await rest.put(
			Routes.applicationGuildCommands(process.env.APPLICATION_ID, guildId),
			{
				body: commands.map(command => {
					const data = command.data.toJSON();
					data.default_permission = command?.defaultPermission ?? true;
					return data;
				}),
			},
		);
		await permissionsForGuild(guildId);
		console.info('Slash commands succesvol geïnitialiseerd voor: ' + guildId);
	}
	catch (error) {
		console.error(error);
	}
}

module.exports = { commands, slashCommandsForGuild };