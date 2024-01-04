import Client from "@/classes/Client";
import EventHandler from "@/classes/EventHandler";
import Guild from "@/models/Guild";
import { MessageType } from "@/types";
import { ChannelType } from "discord.js";

export default new EventHandler({
    event: "guildMemberRemove",
    async execute(_, [member]) {
        const settings = await new Guild(member.guild.id).fetch();

        if (!settings.goodbyeMessageEnabled || !settings.goodbyeMessage || !settings.goodbyeMessageChannel) return;

        const goodbyeMessage = settings.goodbyeMessage
            .replace("{{naam}}", `${member}`)
            .replace("{{server}}", member.guild.name);

        const goodbyeMessageChannel = member.guild.channels.cache.get(settings.goodbyeMessageChannel);
        if (!goodbyeMessageChannel || goodbyeMessageChannel.type !== ChannelType.GuildText) return;

        goodbyeMessageChannel.send({
            embeds: [
                Client.embed(MessageType.Error)
                    .setTitle(`${member.guild.name}`)
                    .setDescription(goodbyeMessage)
                    .setThumbnail(`${member.user.displayAvatarURL()}`)
                    .setFooter({ text: `Er zijn nu ${member.guild.memberCount} leden!` }),
            ],
        });
    },
});
