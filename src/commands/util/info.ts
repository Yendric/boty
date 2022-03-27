import { CommandInteraction, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder().setName("info").setDescription("Info over de discord server."),
  async execute(interaction: CommandInteraction, { guild, member }: CommandProps) {
    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle(guild.name + " | Info")
          .setColor("#33aaff")
          .addField("Leden:", `${guild.memberCount}`, true)
          .addField("Bots:", `${guild.members.cache.filter((member) => member.user.bot).size}`, true)
          .addField("Mensen:", `${guild.members.cache.filter((member) => !member.user.bot).size}`, true)
          .addField(
            "Online mensen:",
            `${
              guild.members.cache.filter(
                (member) => !member.user.bot && (member?.presence?.status ?? "offline") !== "offline"
              ).size
            }`,
            true
          )
          .addField(
            "Offline mensen:",
            `${
              guild.members.cache.filter(
                (member) => !member.user.bot && (member?.presence?.status ?? "offline") == "offline"
              ).size
            }`,
            true
          )
          .addField("Gemaakt op:", `${guild.createdAt.toLocaleString()}`, true)
          .addField("Eigenaar:", `${guild.members.cache.get(guild.ownerId)}`, true)
          .setTimestamp()
          .setThumbnail(guild.iconURL() ?? "")
          .setFooter("Opgevraagd door " + member.user.username)
          .toJSON(),
      ],
    });
  },
};
