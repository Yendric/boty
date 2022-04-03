import { CommandInteraction, GuildMember, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { getUser } from "../../utils/database";
import CommandProps from "../../types/CommandProps";
import { getXpData } from "../../services/level";

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
    const userXpData = getXpData(user);

    const levelEmbed = new MessageEmbed()
      .setAuthor({ name: `${guild.name} | Level info van ${member.displayName}` })
      .setDescription(
        `Level: **${userXpData.level}**
      XP: **${userXpData.xp}**
      Berichten verzonden: **${userXpData.messages}**`
      )
      .setThumbnail(member.user.displayAvatarURL())
      .setColor("#33aaff")
      .setFooter({ text: `Je bent op ${userXpData.percentage}% naar level ${userXpData.level + 1}!` });

    interaction.reply({ embeds: [levelEmbed] });
  },
};
