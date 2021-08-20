const { client } = require('..');
const { Collection } = require('discord.js');
const { getFiles } = require('../helpers/files');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

client.commands = new Collection();
const commandFiles = getFiles('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Er is iets foutsgegaan bij het uitvoeren van dit commando!', ephemeral: true });
	}
});


const commands = [];

const clientId = '838487937187446825';
const guildId = '477520754632818689';

for (const file of commandFiles) {
	const command = require(`../commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.token);

(async () => {
	try {
		console.info('Slash commands worden geïnitialiseerd.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		// await rest.put(
		// 	Routes.applicationCommands(clientId),
		// 	{ body: commands },
		// );

		console.info('Slash commands zijn succesvol geïnitialiseerd.');
	}
	catch (error) {
		console.error(error);
	}
})();