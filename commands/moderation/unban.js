const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { client } = require('../..');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('Unban een gebruiker.')
		.addStringOption(option =>
			option.setName('snowflake')
				.setDescription('Wie moet er geunbanned worden? (snowflake)')
				.setRequired(true),
		),
	defaultPermission: false,
	async execute(interaction) {
		if (!interaction.guild.me.permissionsIn(interaction.channel).has('BAN_MEMBERS')) return interaction.reply('Ik heb hier geen toestemming voor.');

		const gebruiker = await client.users.fetch(interaction.options.getString('snowflake')).catch(() => { return null; });
		if (!gebruiker) return interaction.reply('Gelieve een snowflake op te geven');

		const banList = await interaction.guild.bans.cache;
		const bannedUser = banList.find(user => user.id === gebruiker.id);
		if (!bannedUser) return await interaction.reply(`${gebruiker} is niet verbannen.`);

		const banEmbed = new MessageEmbed()
			.setTitle(`${interaction.guild.name} | Moderatie`)
			.setDescription(`Wil je ${gebruiker} unbannen?`)
			.setColor('#00ff00')
			.setFooter(`Opgevraagd door ${interaction.member.displayName}`);

		const bannedEmbed = new MessageEmbed()
			.setTitle(`${interaction.guild.name} | Moderatie`)
			.setDescription(`**Unbanned: ${gebruiker}**
			**Door:** ${interaction.member}`)
			.setColor('#00ff00')
			.setTimestamp()
			.setFooter(`Opgevraagd door ${interaction.member.displayName}`);
		const buttons = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('akkoord')
					.setLabel('✅')
					.setStyle('SUCCESS'),
			).addComponents(
				new MessageButton()
					.setCustomId('weiger')
					.setLabel('❌')
					.setStyle('DANGER'),
			);

		interaction.reply({ embeds: [banEmbed], components: [buttons] });

		const filter = i => i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });

		collector.on('collect', async i => {
			if (i.customId === 'akkoord') {
				await i.update({ content: 'Unban wordt uigevoerd!', components: [], embeds: [] });
				try {
					await interaction.guild.members.unban(gebruiker);
					interaction.followUp({ embeds: [bannedEmbed] });
				}
				catch(error) {
					console.error(error);
					interaction.channel.send('Er is iets fout gelopen');
				}
			}
			else if (i.customId === 'weiger') {
				await i.update({ content: 'Unban geannuleerd!', components: [], embeds: [] });
			}
		});

		collector.on('end', collected => collected.size == 0 && interaction.editReply({ content: 'Unban geannuleerd!', components: [], embeds: [] }));

	},
};
