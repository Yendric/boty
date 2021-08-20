const ytdl = require('ytdl-core');
const { MessageEmbed } = require('discord.js');
const {
	AudioPlayerStatus,
	createAudioPlayer,
	createAudioResource,
	joinVoiceChannel,
	StreamType,
} = require('@discordjs/voice');


const queue = new Map();
async function initializePlayer(guild) {
	const serverQueue = queue.get(guild.id);
	const connection = joinVoiceChannel({
		channelId: serverQueue.voiceChannel.id,
		guildId: guild.id,
		adapterCreator: guild.voiceAdapterCreator,
	});
	serverQueue.connection = connection;

	serverQueue.player = createAudioPlayer();
	serverQueue.connection.subscribe(serverQueue.player);

	play(guild);
}
async function play(guild) {
	const serverQueue = queue.get(guild.id);

	if(!serverQueue) return;
	if(serverQueue?.songs.length === 0 && serverQueue) {
		serverQueue.connection.destroy();
		return queue.delete(guild.id);
	}

	const song = serverQueue.songs[0];
	const stream = ytdl(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1048576 * 32 });
	const resource = createAudioResource(stream, { inputType: StreamType.Arbitrary });
	serverQueue.player.play(resource);

	serverQueue.player.on(AudioPlayerStatus.Idle, () => {
		// destroy ytdl stream, tegen memory leak
		stream.destroy();
		serverQueue.songs.shift();
		play(guild);
	});

	serverQueue.textChannel.send({ embeds:[
		new MessageEmbed()
			.setTitle(`Nu speelt: **${song.title}**`)
			.setDescription(song.url)
			.setThumbnail(song.thumbnail),
	] });
}
function skip(guild) {
	const serverQueue = queue.get(guild.id);
	if (!serverQueue) throw new Error('no_song_playing');
	serverQueue.player.stop();
}
function stop(guild) {
	const serverQueue = queue.get(guild.id);
	if (!serverQueue) throw new Error('no_song_playing');
	queue.delete(guild.id);
	serverQueue.connection.destroy();
}
module.exports = { queue, play: initializePlayer, skip, stop };


// function audioResource(song) {
// 	return new Promise((resolve, reject) => {
// 		const process = ytdl(
// 			song.url,
// 			{
// 				o: '-',
// 				q: '',
// 				f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
// 				r: '100K',
// 			},
// 			{ stdio: ['ignore', 'pipe', 'ignore'] },
// 		);
// 		if (!process.stdout) {
// 			reject(new Error('No stdout'));
// 			return;
// 		}
// 		const stream = process.stdout;
// 		const onError = (error) => {
// 			if (!process.killed) process.kill();
// 			stream.resume();
// 			reject(error);
// 		};
// 		process
// 			.once('spawn', () => {
// 				demuxProbe(stream)
// 					.then((probe) => resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type })))
// 					.catch(onError);
// 			})
// 			.catch(onError);
// 	});
// }