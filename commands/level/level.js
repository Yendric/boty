const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUser } = require('../../helpers/database');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('level')
		.setDescription('Bekijk het level van een gebruiker.')
		.addUserOption(option =>
			option.setName('gebruiker')
				.setDescription('Van wie wil je het level bekijken? (Standaard: jij)')
				.setRequired(false),
		),
	async execute(interaction) {
		const gebruiker = interaction.options.getMember('gebruiker');
		const member = gebruiker ? gebruiker : interaction.guild.members.cache.get(interaction.member.id);
		const userData = await getUser(member.id);

		const userLevel = userData.get('level');
		const xpUser = userData.get('xp');
		const nextLevelXp = userLevel * userLevel * 300;
		const prevLevelXp = (userLevel - 1) * (userLevel - 1) * 300;
		const percentage = Math.round(((xpUser - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100);
		const messages = userData.get('messages');

		const levelEmbed = new MessageEmbed()
			.setAuthor(`${interaction.guild.name} | Level info van ${member.displayName}`)
			.setDescription(`Level: **${userLevel}**\nXP: **${xpUser}**\nBerichten verzonden: **${messages}**`)
			.setThumbnail(member.user.displayAvatarURL())
			.setColor('#33aaff')
			.setFooter(`Je bent op ${percentage}% naar level ${userLevel + 1}!`);

		interaction.reply({ embeds: [levelEmbed] });
	},
};