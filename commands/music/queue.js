const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { queue, skip, stop } = require('../../bootstrap/music');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('Bekijk de wachtrij.'),
	async execute(interaction) {
		const serverQueue = queue.get(interaction.guild.id);
		const songs = serverQueue?.songs;
		if (!songs) return interaction.reply('Geen liedjes in de queue');

		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('skip')
					.setLabel('Skip liedje')
					.setStyle('PRIMARY'),
			).addComponents(
				new MessageButton()
					.setCustomId('stop')
					.setLabel('Stop met spelen')
					.setStyle('DANGER'),
			);

		const collector = interaction.channel.createMessageComponentCollector();

		collector.on('collect', async i => {
			if (i.customId === 'skip') {
				skip(interaction.guild);
				i.update({ embeds:[generateEmbed(songs)], content: 'Liedje geskipt.' });
			}
			else if (i.customId === 'stop') {
				stop(interaction.guild);
				i.update({ embeds:[], content: 'Muziek gestopt.', components: [] });

			}
		});

		return interaction.reply({ embeds: [generateEmbed(songs)], components: [buttons] });
	},
};

function generateEmbed(songs) {
	const embed = new MessageEmbed()
		.setTitle('Queue');

	for (const [index, song] of songs.entries()) {
		embed.addField(index == 0 ? 'Nu speelt: **' + song.title + '**' : index + '. **' + song.title + '**', song.url);
	}
	return embed;
}