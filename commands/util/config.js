const { SlashCommandBuilder } = require('@discordjs/builders');
const { getSettings } = require('../../helpers/database');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('Toont de huidige server configuratie.'),
	async execute(interaction) {
		const settings = await getSettings(interaction.guild.id);
		interaction.reply(`De huidige server configuratie: \`\`\`js\n${JSON.stringify(settings, undefined, 2)} \`\`\``);
	},
};