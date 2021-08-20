const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Verwijder een aantal berichten.')
		.addIntegerOption(option =>
			option.setName('aantal')
				.setDescription('Hoeveel berichten wil je verwijderen (1-99)?')
				.setRequired(true),
		),
	async execute(interaction) {
		const guild = interaction.guild;
		const channel = interaction.channel;
		const hoeveelheid = interaction.options.getInteger('aantal');

		if(hoeveelheid < 1 || hoeveelheid > 99) return interaction.reply('Kies een getal van 1 tot 99!');

		const embed = new MessageEmbed()
			.setTitle(`${guild.name} | Moderatie`)
			.setTimestamp()
			.setFooter(`Opgevraagd door ${interaction.member.displayName}`);

		try {
			await channel.bulkDelete(hoeveelheid);
			interaction.reply({ embeds: [
				embed
					.setColor('#00ff00')
					.setDescription(`${hoeveelheid} ${hoeveelheid == 1 ? 'bericht' : 'berichten'} verwijderd.`),
			] });
			setTimeout(() => interaction.deleteReply(), 5000);
		}
		catch(err) {
			interaction.reply({ embeds: [
				embed
					.setColor('#ff0000')
					.setDescription('Er is iets misgegaan (zijn er berichten ouder dan 14 dagen?).'),
			] });
			// deze catch is voor als iemand heel snel achter elkaar clear gebruikt.
			setTimeout(() => interaction.deleteReply().catch(() => null), 5000);
		}
	},
};