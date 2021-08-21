const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ms = require('ms');
const { client } = require('../..');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('giveaway')
		.setDescription('Start een giveaway.')
		.addIntegerOption(option =>
			option.setName('winnaars')
				.setDescription('Hoeveel winnaars moeten er zijn?')
				.setRequired(true),
		).addStringOption(option =>
			option.setName('tijd')
				.setDescription('Hoelang moet de giveaway duren? (bv 1d5h3m)')
				.setRequired(true),
		).addChannelOption(option =>
			option.setName('channel')
				.setDescription('In welk channel moet de giveaway plaatsvinden?')
				.setRequired(true),
		).addStringOption(option =>
			option.setName('item')
				.setDescription('Geef een beschrijving van het item dat wordt weggegeven.')
				.setRequired(true),
		),
	defaultPermission: false,
	async execute(interaction) {
		const aantalWinnaars = interaction.options.getInteger('winnaars');
		const tijd = interaction.options.getString('tijd');
		const channel = interaction.options.getChannel('channel');
		const item = interaction.options.getString('item');

		const giveawayEmbed = new MessageEmbed()
			.setTitle(`🎉 **GIVEAWAY: ${item}** `)
			.setDescription(`**Aantal winnaars**: ${aantalWinnaars}\n**Eindigt op**: ${new Date(new Date().getTime() + ms(tijd))}`)
			.setFooter('Eindigt om')
			.setTimestamp()
			.setColor('#00FF00');


		await interaction.reply('Giveaway aangemaakt!');
		const embedSend = await channel.send({ embeds: [giveawayEmbed] });
		embedSend.react('🎉');

		setTimeout(async function() {
			const winners = [];
			let peopleReacted = embedSend.reactions.cache.first().users.cache;

			peopleReacted = peopleReacted.filter(user => user.id !== client.user.id);

			if (peopleReacted.length < aantalWinnaars) {
				embedSend.edit(new MessageEmbed()
					.setTitle(`🎉 **GIVEAWAY: ${item}** `)
					.setDescription('**Winnaars**: niemand heeft gewonnen')
					.setFooter('Beëindigt om')
					.setTimestamp()
					.setColor('#00FF00'));
				return channel.send('Er waren te weinig deelnemers dus niemand heeft gewonnen');
			}

			for (let i = 0; i < aantalWinnaars; i++) {
				const winner = peopleReacted.random();
				winners.push(winner);
				peopleReacted.delete(winner.id);
			}

			embedSend.edit(new MessageEmbed()
				.setTitle(`🎉 **GIVEAWAY: ${item}** `)
				.setDescription(`**Winnaars**: ${winners.join()}`)
				.setFooter('Beëindigt om')
				.setTimestamp()
				.setColor('#00FF00'));
			winners.forEach(winner => {
				channel.send(`Gefeliciteerd ${winner}! Je hebt **${item}** gewonnen.`);
			});
		}, ms(tijd));
	},
};
