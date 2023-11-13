import { ChannelType, EmbedBuilder, GuildMember } from "discord.js";
import { getSettings } from "../utils/database";

export default {
  name: "guildMemberAdd",
  async execute(member: GuildMember) {
    const serverSettings = await getSettings(member.guild);

    if (serverSettings.welcomeMessageEnabled && serverSettings.welcomeMessage && serverSettings.welcomeMessageChannel) {
      const welcomeMessage = serverSettings.welcomeMessage
        .replace("{{naam}}", `${member}`)
        .replace("{{server}}", member.guild.name);

      const welcomeMessageChannel = member.guild.channels.cache.get(serverSettings.welcomeMessageChannel);
      if (!welcomeMessageChannel || welcomeMessageChannel.type !== ChannelType.GuildText) return;

      welcomeMessageChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${member.guild.name}`)
            .setColor("#00ff00")
            .setDescription(welcomeMessage)
            .setThumbnail(`${member.user.displayAvatarURL()}`)
            .setTimestamp()
            .setFooter({ text: `Er zijn nu ${member.guild.memberCount} leden!` }),
        ],
      });
    }
  },
};
