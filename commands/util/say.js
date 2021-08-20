const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Laat de bot iets zeggen.')
		.addStringOption(option =>
			option.setName('bericht')
				.setDescription('Wat wil je me laten zeggen?')
				.setRequired(true),
		),
	async execute(interaction) {
		interaction.reply('Actie wordt uitgevoerd...');
		interaction.channel.send(interaction.options.getString('bericht'));
		interaction.deleteReply();
	},
};