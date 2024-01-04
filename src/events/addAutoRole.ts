import EventHandler from "@/classes/EventHandler";
import Guild from "@/models/Guild";

export default new EventHandler({
    event: "guildMemberAdd",
    async execute(_, [member]) {
        const settings = await new Guild(member.guild.id).fetch();

        if (!settings.autoRoleEnabled || !settings.autoRole) return;

        const autoRole = member.guild.roles.cache.get(settings.autoRole);
        if (!autoRole) return;

        member.roles.add(autoRole);
    },
});
