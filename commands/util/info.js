const { MessageEmbed } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getMember } = require('../../helpers/discord');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Info over de discord server.'),
	async execute(interaction) {
		const guild = interaction.guild;
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle(guild.name + ' | Info')
					.setColor('#33aaff')
					.addField('Leden:', `${guild.memberCount}`, true)
					.addField('Bots:', `${guild.members.cache.filter(member => member.user.bot).size}`, true)
					.addField('Mensen:', `${guild.members.cache.filter(member => !member.user.bot).size}`, true)
					.addField('Online mensen:', `${guild.members.cache.filter(member => !member.user.bot && (member?.presence.status ?? 'offline') !== 'offline').size}`, true)
					.addField('Offline mensen:', `${guild.members.cache.filter(member => !member.user.bot && (member?.presence.status ?? 'offline') == 'offline').size}`, true)
					.addField('Gemaakt op:', `${guild.createdAt.toLocaleString()}`, true)
					.addField('Eigenaar:', `${getMember(guild.id, guild.ownerId)}`, true)
					.setTimestamp()
					.setThumbnail(guild.iconURL())
					.setFooter('Opgevraagd door ' + interaction.member.displayName)
					.toJSON(),
			],
		});
	},
};
