const ytdl = require('ytdl-core');
const search = require('youtube-search');
const { MessageEmbed } = require('discord.js');
const { queue, play } = require('../../bootstrap/music');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('play')
		.setDescription('Speel een liedje.')
		.addStringOption(option =>
			option.setName('liedje')
				.setDescription('Welk liedje moet er gespeeld worden?')
				.setRequired(true),
		),
	async execute(interaction) {
		const voiceChannel = interaction.member?.voice?.channel;
		if (!voiceChannel) return interaction.reply('Je moet in een voicechannel zitten!');

		const searchQueryOrURI = interaction.options.getString('liedje');
		let song = {};
		if (ytdl.validateURL(searchQueryOrURI)) {
			const songInfo = await ytdl.getInfo(searchQueryOrURI);
			song = {
				title: songInfo.videoDetails.title,
				url: songInfo.videoDetails.video_url,
				thumbnail: songInfo.videoDetails.thumbnails[0].url,
			};
		}
		else {
			const { results } = await search(searchQueryOrURI, { maxResults: 1, key: process.env.YOUTUBE_API_KEY });
			if (!results.length) return interaction.reply('Geen liedjes gevonden!');
			const result = results[0];
			song = {
				title: result.title,
				url: result.link,
				thumbnail: result.thumbnails.default.url,
			};
		}

		interaction.reply(`Liedje gevonden: **${song.title}**`);

		if (!queue.get(interaction.guild.id)) {
			const queueContruct = {
				textChannel: interaction.channel,
				voiceChannel: voiceChannel,
				connection: null,
				player: null,
				songs: [],
				volume: 5,
			};

			queueContruct.songs.push(song);
			queue.set(interaction.guild.id, queueContruct);

			try {
				play(interaction.guild);
			}
			catch (err) {
				console.error(err);
				queue.delete(interaction.guild.id);
				return interaction.reply('Er is iets foutgegaan');
			}
		}
		else {
			queue.get(interaction.guild.id).songs.push(song);
			interaction.channel.send({ embeds: [new MessageEmbed()
				.setTitle(`Toegevoegd aan queue: **${song.title}**`)
				.setDescription(song.url)
				.setThumbnail(song.thumbnail),
			] });
		}
	},
};