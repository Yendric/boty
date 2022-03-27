import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getUser } from "../../utils/database";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder()
    .setName("level")
    .setDescription("Bekijk het level van een gebruiker.")
    .addUserOption((option) =>
      option
        .setName("gebruiker")
        .setDescription("Van wie wil je het level bekijken? (Standaard: jij)")
        .setRequired(false)
    ),
  async execute(interaction: CommandInteraction, { guild, member: interactionMember, options }: CommandProps) {
    const gebruiker = options.getMember("gebruiker");
    const member = (gebruiker as GuildMember) ?? interactionMember;
    if (!member) return;

    const user = await getUser(member.id);

    const userLevel = user.get("level");
    const userXp = user.get("xp");
    const nextLevelXp = userLevel ** 2 * 300;
    const prevLevelXp = (userLevel - 1) ** 2 * 300;
    const percentage = Math.round(((userXp - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100);
    const messages = user.get("messages");

    const levelEmbed = new MessageEmbed()
      .setAuthor(`${guild.name} | Level info van ${member.displayName}`)
      .setDescription(
        `Level: **${userLevel}**
      XP: **${userXp}**
      Berichten verzonden: **${messages}**`
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setColor("#33aaff")
      .setFooter(`Je bent op ${percentage}% naar level ${userLevel + 1}!`);

    interaction.reply({ embeds: [levelEmbed] });
  },
};
