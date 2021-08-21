const { commands } = require('../bootstrap/commands');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
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
	},
};