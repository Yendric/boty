const ytdl = require('ytdl-core');
const Discord = require('discord.js');
const client = require('../index');
const {
	AudioPlayerStatus,
	StreamType,
	createAudioPlayer,
	createAudioResource,
} = require('@discordjs/voice');

client.music = {
	/* Music bot code */
	queue: new Map(),
	play: async (guild, song) => {
		const serverQueue = client.music.queue.get(guild.id);
		if (!song) {
			serverQueue.connection.destroy();
			client.music.queue.delete(guild.id);
			return;
		}

		const stream = ytdl(song.url, { filter:'audioonly' });
		const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
		const player = createAudioPlayer();

		player.play(resource);
		serverQueue.connection.subscribe(player);

		player.on(AudioPlayerStatus.Idle, () => {
			serverQueue.connection.destroy();
			serverQueue.songs.shift();
			client.music.play(guild, serverQueue.songs[0]);
		});

		serverQueue.textChannel.send({ embeds:[
			new Discord.MessageEmbed()
				.setTitle(`Nu speelt: **${song.title}**`)
				.setDescription(song.url)
				.setThumbnail(song.thumbnail),
		] });
	},
};