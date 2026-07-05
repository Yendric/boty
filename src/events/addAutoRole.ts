import EventHandler from "@/classes/EventHandler";
import Guild from "@/models/Guild";
import { Events } from "discord.js";

export default new EventHandler({
    event: Events.GuildMemberAdd,
    async execute(_, [member]) {
        const settings = await new Guild(member.guild.id).fetch();

        if (!settings.autoRoleEnabled || !settings.autoRole) return;

        const autoRole = member.guild.roles.cache.get(settings.autoRole);
        if (!autoRole) return;

        await member.roles.add(autoRole);
    },
});
