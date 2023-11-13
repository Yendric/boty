import { ChannelType, Message } from "discord.js";
import { getSettings } from "../utils/database";
import { validURL } from "../utils/string";

export default {
  name: "messageCreate",
  async execute(message: Message) {
    if (message.author.bot) return;
    if (message.channel.type == ChannelType.DM) return;
    if (!message.guild) return;

    const serverSettings = await getSettings(message.guild);

    if (serverSettings.memesEnabled && message.channel.id === serverSettings.memesChannel) {
      if (message.attachments.size == 0 && !validURL(message.content)) return;
      await message.react("👍");
      await message.react("👎");
    }
  },
};
