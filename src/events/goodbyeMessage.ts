import { ChannelType, EmbedBuilder, GuildMember } from "discord.js";
import { getSettings } from "../utils/database";

export default {
  name: "guildMemberRemove",
  async execute(member: GuildMember) {
    const serverSettings = await getSettings(member.guild);

    if (serverSettings.goodbyeMessageEnabled && serverSettings.goodbyeMessage && serverSettings.goodbyeMessageChannel) {
      const goodbyeMessage = serverSettings.goodbyeMessage
        .replace("{{naam}}", `${member}`)
        .replace("{{server}}", member.guild.name);

      const goodbyeMessageChannel = member.guild.channels.cache.get(serverSettings.goodbyeMessageChannel);
      if (!goodbyeMessageChannel || goodbyeMessageChannel.type !== ChannelType.GuildText) return;

      goodbyeMessageChannel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${member.guild.name}`)
            .setColor("#ff0000")
            .setDescription(goodbyeMessage)
            .setThumbnail(`${member.user.displayAvatarURL()}`)
            .setTimestamp(new Date())
            .setFooter({ text: `Er zijn nu ${member.guild.memberCount} leden!` }),
        ],
      });
    }
  },
};
