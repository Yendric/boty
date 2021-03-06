import ytdl from "ytdl-core";
import { Guild, MessageEmbed, TextChannel, VoiceBasedChannel } from "discord.js";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
  StreamType,
} from "@discordjs/voice";
import GuildQueue from "../types/GuildQueue";
import { CommandExecutionError } from "../errors/CommandExecutionError";
import QueueSong from "../types/QueueSong";

export const queues = new Map<Guild, GuildQueue>();

export async function initializePlayer(
  guild: Guild,
  voiceChannel: VoiceBasedChannel,
  textChannel: TextChannel,
  songs: QueueSong[]
) {
  const queue: GuildQueue = {
    songs,
    voiceChannel,
    connection: joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator,
    }),
    player: createAudioPlayer(),
    textChannel,
  };

  queue.connection.subscribe(queue.player);
  queues.set(guild, queue);

  playQueue(guild);
}

export async function playQueue(guild: Guild) {
  const queue = queues.get(guild);
  if (!queue) throw new CommandExecutionError("Er speelt geen liedje!");

  if (!queue.songs.length) return stop(guild);

  const song = queue.songs[0];
  const stream = ytdl(song.url, {
    filter: "audioonly",
    quality: "highestaudio",
    highWaterMark: 1048576 * 32,
  });
  const resource = createAudioResource(stream, {
    inputType: StreamType.Arbitrary,
  });
  queue.player.play(resource);

  let embed = new MessageEmbed().setTitle(`Nu speelt: **${song.title}**`).setDescription(song.url);
  if (song.thumbnail) embed = embed.setThumbnail(song.thumbnail);

  queue.textChannel.send({
    embeds: [embed],
  });

  queue.player.on(AudioPlayerStatus.Idle, () => {
    stream.destroy();
    queue.songs.shift();
    playQueue(guild);
  });
}

export function pause(guild: Guild) {
  const queue = queues.get(guild);
  if (!queue) throw new CommandExecutionError("Er speelt geen liedje!");

  queue.player.pause();
}

export function resume(guild: Guild) {
  const queue = queues.get(guild);
  if (!queue) throw new CommandExecutionError("Er speelt geen liedje!");

  queue.player.unpause();
}

export function skip(guild: Guild) {
  const queue = queues.get(guild);
  if (!queue) throw new CommandExecutionError("Er speelt geen liedje!");

  queue.player.stop();
}

export function stop(guild: Guild) {
  const queue = queues.get(guild);
  if (!queue) throw new CommandExecutionError("Er speelt geen liedje!");

  queue.connection.destroy();
  return queues.delete(guild);
}
