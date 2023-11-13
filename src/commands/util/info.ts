import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder().setName("info").setDescription("Info over de discord server."),
  async execute(interaction: CommandInteraction, { guild, member }: CommandProps) {
    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(guild.name + " | Info")
          .setColor("#33aaff")
          .addFields([
            { name: "Leden:", value: `${guild.memberCount}`, inline: true },
            { name: "Bots:", value: `${guild.members.cache.filter((member) => member.user.bot).size}`, inline: true },

            {
              name: "Mensen:",
              value: `${guild.members.cache.filter((member) => !member.user.bot).size}`,
              inline: true,
            },
            {
              name: "Online mensen:",
              value: `${
                guild.members.cache.filter(
                  (member) => !member.user.bot && (member?.presence?.status ?? "offline") !== "offline"
                ).size
              }`,
              inline: true,
            },
            {
              name: "Offline mensen:",
              value: `${
                guild.members.cache.filter(
                  (member) => !member.user.bot && (member?.presence?.status ?? "offline") == "offline"
                ).size
              }`,
              inline: true,
            },
            {
              name: "Gemaakt op:",
              value: `${guild.createdAt.toLocaleString()}`,
              inline: true,
            },
            {
              name: "Eigenaar:",
              value: `${guild.members.cache.get(guild.ownerId)}`,
              inline: true,
            },
          ])
          .setTimestamp()
          .setThumbnail(guild.iconURL() ?? "")
          .setFooter({ text: "Opgevraagd door " + member.user.username })
          .toJSON(),
      ],
    });
  },
};
