import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import Users from "../../models/User";

export default {
  data: new SlashCommandBuilder().setName("leveltop").setDescription("Toont de beste gamers."),
  async execute(interaction: CommandInteraction) {
    const points = await Users.findAll({
      order: [["xp", "DESC"]],
      limit: 10,
    });

    const embed = new MessageEmbed()
      .setTitle("Leveltop")
      .setDescription("Top 10 gamers in alle Boty servers!")
      .setColor(0x00ae86);
    for (const [i, data] of points.entries()) {
      embed.addField("#" + (i + 1), `<@${data.snowflake}>: ${data.xp} XP (level ${data.level})`);
    }
    return interaction.reply({ embeds: [embed] });
  },
};
