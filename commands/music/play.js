const { SlashCommand, CommandOptionType } = require('slash-create');
const ytdl = require('ytdl-core');
const {
	joinVoiceChannel,
} = require('@discordjs/voice');
const search = require('youtube-search');
const client = require('../../index.js');
const { MessageEmbed } = require('discord.js');

module.exports = class PlayCommand extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'play',
			description: 'Speel muziek.',
			options: [{
				type: CommandOptionType.STRING,
				name: 'liedje',
				description: 'Welk liedje wil je spelen?',
				required: true,
			}],
		});
	}

	async run(ctx) {
		ctx.defer();
		const voiceChannel = client.guilds.cache.get(ctx.guildID).members.cache.get(ctx.member.id)?.voice?.channel;
		if (!voiceChannel) return ctx.send('Je moet in een voicechannel zitten!');

		let song = {};
		if (ytdl.validateURL(ctx.options.liedje)) {
			const songInfo = await ytdl.getInfo(ctx.options.liedje);
			song = {
				title: songInfo.videoDetails.title,
				url: songInfo.videoDetails.video_url,
				thumbnail: songInfo.videoDetails.thumbnail_url,
			};
		}
		else {
			const { results } = await search(ctx.options.liedje, { maxResults: 1, key: 'AIzaSyDdujnApOugMJxodxUs13FULkVF-AuNZHc' });
			if (!results.length) return ctx.send('Geen liedjes gevonden!');
			const result = results[0];
			song = {
				title: result.title,
				url: result.link,
				thumbnail: result.thumbnails.default.url,
			};
		}

		ctx.send(`Liedje gevonden: **${song.title}**`);

		if (!client.music.queue.get(ctx.guildID)) {
			const queueContruct = {
				textChannel: client.channels.cache.get(ctx.channelID),
				voiceChannel: voiceChannel,
				connection: null,
				songs: [],
				volume: 5,
				playing: true,
			};

			client.music.queue.set(ctx.guildID, queueContruct);

			queueContruct.songs.push(song);

			try {
				const connection = joinVoiceChannel({
					channelId: voiceChannel.id,
					guildId: ctx.guildID,
					adapterCreator: client.guilds.cache.get(ctx.guildID).voiceAdapterCreator,
				});
				console.log(voiceChannel.id);
				queueContruct.connection = connection;
				client.music.play(client.guilds.cache.get(ctx.guildID), queueContruct.songs[0]);
			}
			catch (err) {
				console.log(err);
				client.music.queue.delete(ctx.guildID);
				return ctx.send('Er is iets foutgegaan');
			}
		}
		else {
			client.music.queue.get(ctx.guildID).songs.push(song);
			client.guilds.cache.get(ctx.guildID).channels.cache.get(ctx.channelID).send({ embeds: [new MessageEmbed()
				.setTitle(`Toegevoegd aan queue: **${song.title}**`)
				.setDescription(song.url)
				.setThumbnail(song.thumbnail),
			] });
		}
	}
};