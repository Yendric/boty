import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Verwijder een aantal berichten.")
    .addIntegerOption((option) =>
      option.setName("aantal").setDescription("Hoeveel berichten wil je verwijderen (1-99)?").setRequired(true)
    ),
  defaultPermission: false,
  async execute(interaction: CommandInteraction, { guild, channel, options, member }: CommandProps) {
    const hoeveelheid = options.getInteger("aantal");
    if (!hoeveelheid || hoeveelheid < 1 || hoeveelheid > 99) return interaction.reply("Kies een getal van 1 tot 99!");

    const embed = new EmbedBuilder()
      .setTitle(`${guild.name} | Moderatie`)
      .setTimestamp()
      .setFooter({ text: `Opgevraagd door ${member.displayName}` });

    try {
      await channel.bulkDelete(hoeveelheid);
      interaction.reply({
        embeds: [
          embed
            .setColor("#00ff00")
            .setDescription(`${hoeveelheid} ${hoeveelheid == 1 ? "bericht" : "berichten"} verwijderd.`),
        ],
      });
      setTimeout(() => interaction.deleteReply(), 5000);
    } catch (err) {
      interaction.reply({
        embeds: [
          embed.setColor("#ff0000").setDescription("Er is iets misgegaan (zijn er berichten ouder dan 14 dagen?)."),
        ],
      });
      setTimeout(() => interaction.deleteReply(), 5000);
    }
  },
};
