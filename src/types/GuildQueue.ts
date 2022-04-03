import { AudioPlayer, VoiceConnection } from "@discordjs/voice";
import { TextChannel, VoiceBasedChannel } from "discord.js";
import QueueSong from "./QueueSong";

export default interface GuildQueue {
  voiceChannel: VoiceBasedChannel;
  textChannel: TextChannel;
  connection: VoiceConnection;
  player: AudioPlayer;
  songs: QueueSong[];
}
