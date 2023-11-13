import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { queues, skip, stop } from "../../services/music";
import CommandProps from "../../types/CommandProps";
import QueueSong from "../../types/QueueSong";

export default {
  data: new SlashCommandBuilder().setName("queue").setDescription("Bekijk de wachtrij."),
  async execute(interaction: CommandInteraction, { guild, channel }: CommandProps) {
    const songs = queues.get(guild)?.songs;
    if (!songs) return interaction.reply("Geen liedjes in de queue");

    const buttons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(new ButtonBuilder().setCustomId("skip").setLabel("Skip liedje").setStyle(ButtonStyle.Primary))
      .addComponents(new ButtonBuilder().setCustomId("stop").setLabel("Stop met spelen").setStyle(ButtonStyle.Danger));

    const collector = channel.createMessageComponentCollector();

    collector.on("collect", async (i) => {
      try {
        if (i.customId === "skip") {
          skip(guild);
          i.update({
            embeds: [generateEmbed(songs.slice(0, songs.length - 1))],
            content: "Liedje geskipt.",
          });
        } else if (i.customId === "stop") {
          stop(guild);
          i.update({ embeds: [], content: "Muziek gestopt.", components: [] });
        }
      } catch (e) {
        /* Wanneer de queue niet meer bestaat en er op een knop gedrukt wordt wordt een error gethrowd, 
        het is echter niet meer nuttig deze aan de gebruiker te tonen, aangezien deze embed toch al niet meer up to date was. */
        return;
      }
    });

    return interaction.reply({
      embeds: [generateEmbed(songs)],
      components: [buttons],
    });
  },
};

function generateEmbed(songs: QueueSong[]) {
  const embed = new EmbedBuilder().setTitle("Queue");

  if (!songs.length) return embed.setDescription("De queue is nu leeg.");
  for (const [index, song] of songs.entries()) {
    embed.addFields([
      {
        name: index == 0 ? "Nu speelt: **" + song.title + "**" : index + ". **" + song.title + "**",
        value: song.url,
      },
    ]);
  }
  return embed;
}
