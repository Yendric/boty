const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick een gebruiker.')
		.addUserOption(option =>
			option.setName('gebruiker')
				.setDescription('Wie moet er gekicked worden?')
				.setRequired(true),
		).addStringOption(option =>
			option.setName('reden')
				.setDescription('Wat is de reden?')
				.setRequired(true),
		),
	async execute(interaction) {
		if (!interaction.guild.me.permissionsIn(interaction.channel).has('KICK_MEMBERS')) return interaction.reply('Ik heb hier geen toestemming voor.');

		const gebruiker = interaction.options.getMember('gebruiker');
		const reden = interaction.options.getString('reden');

		const kickEmbed = new MessageEmbed()
			.setTitle(`${interaction.guild.name} | Moderatie`)
			.setDescription(`Wil je ${gebruiker} kicken?`)
			.setColor('#00ff00')
			.setFooter(`Opgevraagd door ${interaction.member.displayName}`);

		const kickedEmbed = new MessageEmbed()
			.setTitle(`${interaction.guild.name} | Moderatie`)
			.setDescription(`**Gekicked: ${gebruiker}**
			**Door:** ${interaction.member}
			**Reden:** ${reden}`)
			.setColor('#ff0000')
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

		interaction.reply({ embeds: [kickEmbed], components: [buttons] });

		const filter = i => i.user.id === interaction.user.id;
		const collector = interaction.channel.createMessageComponentCollector({ filter, time: 10000 });

		collector.on('collect', async i => {
			if (i.customId === 'akkoord') {
				await i.update({ content: 'Straf wordt uigevoerd!', components: [], embeds: [] });
				try {
					await gebruiker.kick(reden);
					interaction.followUp({ embeds: [kickedEmbed] });
				}
				catch(error) {
					console.error(error);
					interaction.channel.send('Er is iets fout gelopen');
				}
			}
			else if (i.customId === 'weiger') {
				await i.update({ content: 'Straf geannuleerd!', components: [], embeds: [] });
			}
		});

		collector.on('end', collected => collected.size == 0 && interaction.editReply({ content: 'Straf geannuleerd!', components: [], embeds: [] }));

	},
};