const { SlashCommandBuilder } = require('@discordjs/builders');
const { getSettings } = require('../../helpers/database');
const { client } = require('../../');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setconfig')
		.setDescription('Stel een configvariabele in.')
		// Autorole
		.addSubcommand(subcommand =>
			subcommand.setName('auto_role_enabled')
				.setDescription('Zet autorole aan of uit.')
				.addBooleanOption(option =>
					option.setName('auto_role_enabled')
						.setDescription('Zet autorole aan of uit.')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('auto_role')
				.setDescription('Welke role moet gegeven worden?')
				.addRoleOption(option =>
					option.setName('auto_role')
						.setDescription('Welke role moet gegeven worden?')
						.setRequired(true)))
		// Welcome
		.addSubcommand(subcommand =>
			subcommand.setName('welcome_message_enabled')
				.setDescription('Zet de welcome message aan of uit.')
				.addBooleanOption(option =>
					option.setName('welcome_message_enabled')
						.setDescription('Zet de welcome message aan of uit.')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('welcome_message')
				.setDescription('Wat moet er gestuurd worden?')
				.addStringOption(option =>
					option.setName('welcome_message')
						.setDescription('Wat moet er gestuurd worden? Placeholders: {{server}}, {{naam}}')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('welcome_message_channel')
				.setDescription('Waar moet het bericht gestuurd worden worden?')
				.addChannelOption(option =>
					option.setName('welcome_message_channel')
						.setDescription('Waar moet het bericht gestuurd worden worden?')
						.setRequired(true)))
		// Goodbye
		.addSubcommand(subcommand =>
			subcommand.setName('goodbye_message_enabled')
				.setDescription('Zet de welcome message aan of uit.')
				.addBooleanOption(option =>
					option.setName('goodbye_message_enabled')
						.setDescription('Zet de goodbye message aan of uit.')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('goodbye_message')
				.setDescription('Wat moet er gestuurd worden?')
				.addStringOption(option =>
					option.setName('goodbye_message')
						.setDescription('Wat moet er gestuurd worden? Placeholders: {{server}}, {{naam}}')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('goodbye_message_channel')
				.setDescription('Waar moet het bericht gestuurd worden worden?')
				.addChannelOption(option =>
					option.setName('goodbye_message_channel')
						.setDescription('Waar moet het bericht gestuurd worden worden?')
						.setRequired(true)))
		// Memes
		.addSubcommand(subcommand =>
			subcommand.setName('memes_enabled')
				.setDescription('Zet de memes module aan of uit.')
				.addBooleanOption(option =>
					option.setName('memes_enabled')
						.setDescription('Zet de memes module aan of uit.')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand.setName('memes_channel')
				.setDescription('Wat is het memes kanaal?')
				.addChannelOption(option =>
					option.setName('memes_channel')
						.setDescription('Wat is het memes kanaal?')
						.setRequired(true))),
	async execute(interaction) {
		const settings = await getSettings(interaction.guild.id);
		const option = interaction.options.data[0];
		const value = getDataValue(option);
		if(value === null) return interaction.reply('Je moet een tekstkanaal opgeven.');
		try {
			settings[option.name] = getDataValue(option);
			await settings.save();
		}
		catch(error) {
			console.error(error);
			interaction.reply('Er is iets foutgegaan');
		}
		interaction.reply('Waarde succesvol ingesteld. Bekijk de nieuwe config met /config.');
	},
};

function getDataValue(option) {
	const options = option.options[0];
	if(options.type === 'CHANNEL') {
		if(client.channels.cache.get(options.value).type === 'GUILD_TEXT') {
			return options.value;
		}
		else {
			return null;
		}
	}
	return options.value;
}