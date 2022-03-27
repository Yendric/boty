import ytdl from "ytdl-core";
import search from "youtube-search";
import { CommandInteraction, MessageEmbed } from "discord.js";
import { initializePlayer, queues } from "../../services/music";
import { SlashCommandBuilder } from "@discordjs/builders";
import CommandProps from "../../types/CommandProps";
import QueueSong from "../../types/QueueSong";

export default {
  data: new SlashCommandBuilder()
    .setName("play")
    .setDescription("Speel een liedje.")
    .addStringOption((option) =>
      option.setName("liedje").setDescription("Welk liedje moet er gespeeld worden?").setRequired(true)
    ),
  async execute(interaction: CommandInteraction, { guild, channel, member, options }: CommandProps) {
    const voiceChannel = member.voice?.channel;
    if (!voiceChannel) return interaction.reply("Je moet in een voicechannel zitten!");

    const searchQueryOrURI = options.getString("liedje");
    if (!searchQueryOrURI) return;

    let song: QueueSong;
    if (ytdl.validateURL(searchQueryOrURI)) {
      const songInfo = await ytdl.getInfo(searchQueryOrURI);
      song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
        thumbnail: songInfo.videoDetails.thumbnails[0].url,
      };
    } else {
      const { results } = await search(searchQueryOrURI, {
        maxResults: 1,
        key: process.env.YOUTUBE_API_KEY,
      });
      if (!results.length) return interaction.reply("Geen liedjes gevonden!");
      const result = results[0];
      song = {
        title: result.title,
        url: result.link,
        thumbnail: result.thumbnails?.default?.url,
      };
    }

    interaction.reply(`Liedje gevonden: **${song.title}**`);

    const queue = queues.get(guild);
    if (!queue) {
      initializePlayer(guild, voiceChannel, channel, [song]);
    } else {
      queue.songs.push(song);

      let embed = new MessageEmbed().setTitle(`Toegevoegd aan queue: **${song.title}**`).setDescription(song.url);
      if (song.thumbnail) embed = embed.setThumbnail(song.thumbnail);
      channel.send({
        embeds: [embed],
      });
    }
  },
};
