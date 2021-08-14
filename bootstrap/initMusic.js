const ytdl = require('ytdl-core-discord');
const Discord = require('discord.js');
const client = require('../index');

client.music = {
	/* Music bot code */
	queue: new Map(),
	play: async (guild, song) => {
		const serverQueue = client.music.queue.get(guild.id);
		if (!song) {
			serverQueue.voiceChannel.leave();
			client.music.queue.delete(guild.id);
			return;
		}

		const dispatcher = serverQueue.connection
			.play(await ytdl(song.url), { type: 'opus' })
			.on('finish', () => {
				serverQueue.songs.shift();
				client.music.play(guild, serverQueue.songs[0]);
			})
			.on('error', error => console.error(error));
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
		serverQueue.textChannel.send(
			new Discord.MessageEmbed()
				.setTitle(`Nu speelt: **${song.title}**`)
				.setDescription(song.url)
				.setThumbnail(song.thumbnail),
		);
	},
};