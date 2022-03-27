import { GuildMember, MessageEmbed } from "discord.js";
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
      if (!goodbyeMessageChannel || goodbyeMessageChannel.type !== "GUILD_TEXT") return;

      goodbyeMessageChannel.send({
        embeds: [
          new MessageEmbed()
            .setTitle(`${member.guild.name}`)
            .setColor("#ff0000")
            .setDescription(goodbyeMessage)
            .setThumbnail(`${member.user.displayAvatarURL()}`)
            .setTimestamp(new Date())
            .setFooter(`Er zijn nu ${member.guild.memberCount} leden!`),
        ],
      });
    }
  },
};
