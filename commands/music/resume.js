const { SlashCommandBuilder } = require('@discordjs/builders');
const { queue } = require('../../bootstrap/music.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('Hervat de muziek.'),
	async execute(interaction) {
		const serverQueue = queue.get(interaction.guild.id);
		if (!interaction.member?.voice?.channel) return interaction.reply('Je moet in een voice channel zijn om de muziek te hervatten!');
		if (!serverQueue) return interaction.reply('Er speelt geen liedje!');
		serverQueue.player.unpause();
		interaction.reply('Muziek hervat.');
	},
};