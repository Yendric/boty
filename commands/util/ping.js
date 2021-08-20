const { SlashCommandBuilder } = require('@discordjs/builders');
const { client } = require('../..');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Toont de huidige ping.'),
	async execute(interaction) {
		interaction.reply(`API ping: ${Math.round(client.ws.ping)}ms`);
	},
};