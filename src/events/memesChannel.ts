import EventHandler from "@/classes/EventHandler";
import Guild from "@/models/Guild";
import { validURL } from "@/utils/string";
import { ChannelType } from "discord.js";

export default new EventHandler({
    event: "messageCreate",
    async execute(_, [message]) {
        if (message.author.bot || message.channel.type == ChannelType.DM || !message.guild) return;

        const settings = await new Guild(message.guild.id).fetch();

        if (!settings.memesEnabled || message.channel.id !== settings.memesChannel) return;

        if (message.attachments.size == 0 && !validURL(message.content)) return;
        await message.react("👍");
        await message.react("👎");
    },
});
