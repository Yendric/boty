import { GuildMember } from "discord.js";
import { getSettings } from "../utils/database";

export default {
  name: "guildMemberAdd",
  async execute(member: GuildMember) {
    const serverSettings = await getSettings(member.guild);

    if (serverSettings.autoRoleEnabled && serverSettings.autoRole) {
      const autoRole = member.guild.roles.cache.get(serverSettings.autoRole);
      if (!autoRole) return;

      member.roles.add(autoRole);
    }
  },
};
