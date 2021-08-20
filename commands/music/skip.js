const { SlashCommandBuilder } = require('@discordjs/builders');
const { skip } = require('../../bootstrap/music');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('Skip de wachtrij.'),
	async execute(interaction) {
		if (!interaction.member?.voice?.channel) return interaction.reply('Je moet in een voice channel zijn om de muziek te skippen!');
		try {
			skip(interaction.guild);
		}
		catch(error) {
			return interaction.reply('Er speelt geen liedje!');
		}
		interaction.reply('Liedje geskipt.');
	},
};