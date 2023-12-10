import ytdl from "ytdl-core";
import { EmbedBuilder, Guild, TextChannel, VoiceBasedChannel } from "discord.js";
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
      /* @ts-ignore */
      adapterCreator: guild.voiceAdapterCreator,
    }),
    player: createAudioPlayer(),
    textChannel,
  };

  queue.connection.subscribe(queue.player);
  queues.set(guild, queue);

  queue.player.on(AudioPlayerStatus.Idle, () => {
    queue.audioStream?.destroy();
    queue.songs.shift();
    playQueue(guild);
  });

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

  let embed = new EmbedBuilder().setTitle(`Nu speelt: **${song.title}**`).setDescription(song.url);
  if (song.thumbnail) embed = embed.setThumbnail(song.thumbnail);

  queue.textChannel.send({
    embeds: [embed],
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
