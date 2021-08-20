const { SlashCommandBuilder } = require('@discordjs/builders');
const { stop } = require('../../bootstrap/music.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('stop')
		.setDescription('Stop de muziek.'),
	async execute(interaction) {
		if (!interaction.member?.voice?.channel) return interaction.reply('Je moet in een voice channel zijn om de muziek te stoppen!');
		try {
			stop(interaction.guild);
		}
		catch(error) {
			return interaction.reply('Er speelt geen liedje!');
		}
		interaction.reply('De muziek is gestopt.');
	},
};