const { client } = require('..');
const { Collection } = require('discord.js');
const { getFiles } = require('../helpers/files');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = new Collection();
const commandFiles = getFiles('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	commands.set(command.data.name, command);
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

client.guilds.cache.each(guild => {
	slashCommandsForGuild(guild.id);
});

async function slashCommandsForGuild(guildId) {
	try {
		console.info('Slash commands initialiseren voor: ' + guildId);
		await rest.put(
			Routes.applicationGuildCommands(process.env.APPLICATION_ID, guildId),
			{ body: commands.map(command => command.data) },
		);
		console.info('Slash commands succesvol geïnitialiseerd voor: ' + guildId);
	}
	catch (error) {
		console.error(error);
	}
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Er is iets foutsgegaan bij het uitvoeren van dit commando!', ephemeral: true });
	}
});

module.exports = { commands, slashCommandsForGuild };