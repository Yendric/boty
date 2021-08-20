const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const Users = require('../../models/Users');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leveltop')
		.setDescription('Toont de beste gamers.'),
	async execute(interaction) {
		const points = await Users.findAll({
			order: [
				['xp', 'DESC'],
			],
			limit: 10,
		});

		const embed = new MessageEmbed()
			.setTitle('Leveltop')
			.setDescription('Top 10 gamers in alle Boty servers!')
			.setColor(0x00AE86);
		for (const [i, data] of points.entries()) {
			embed.addField('#' + (i + 1), `<@${data.snowflake}>: ${data.xp} XP (level ${data.level})`);
		}
		return interaction.reply({ embeds: [embed] });
	},
};
