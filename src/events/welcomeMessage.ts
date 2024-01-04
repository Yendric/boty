import Client from "@/classes/Client";
import EventHandler from "@/classes/EventHandler";
import Guild from "@/models/Guild";
import { MessageType } from "@/types";
import { ChannelType } from "discord.js";

export default new EventHandler({
    event: "guildMemberAdd",
    async execute(_, [member]) {
        const settings = await new Guild(member.guild.id).fetch();

        if (!settings.welcomeMessageEnabled || !settings.welcomeMessage || !settings.welcomeMessageChannel) return;

        const welcomeMessage = settings.welcomeMessage
            .replace("{{naam}}", `${member}`)
            .replace("{{server}}", member.guild.name);

        const welcomeMessageChannel = member.guild.channels.cache.get(settings.welcomeMessageChannel);
        if (!welcomeMessageChannel || welcomeMessageChannel.type !== ChannelType.GuildText) return;

        welcomeMessageChannel.send({
            embeds: [
                Client.embed(MessageType.Success)
                    .setTitle(`${member.guild.name}`)
                    .setDescription(welcomeMessage)
                    .setThumbnail(`${member.user.displayAvatarURL()}`)
                    .setFooter({ text: `Er zijn nu ${member.guild.memberCount} leden!` }),
            ],
        });
    },
});
