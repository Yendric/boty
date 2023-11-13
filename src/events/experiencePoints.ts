import { ChannelType, EmbedBuilder, Message } from "discord.js";
import { addXp } from "../services/level";
import { getUser } from "../utils/database";

const xpCooldown = new Set();

export default {
  name: "messageCreate",
  async execute(message: Message) {
    if (message.author.bot) return;
    if (message.channel.type == ChannelType.DM) return;
    if (!message.guild) return;

    if (!xpCooldown.has(message.author.id)) {
      const user = await getUser(message.author.id);
      const userXpData = addXp(user);

      if (userXpData.levelUp) {
        message.channel.send({
          embeds: [
            new EmbedBuilder()
              .setAuthor({ name: "Level up!" })
              .setColor("#33AAFF")
              .setThumbnail(message.author.displayAvatarURL())
              .setDescription(`Nieuw level: **${userXpData.level}**`)
              .setFooter({ text: "Woop Woop!" }),
          ],
        });
      }
      xpCooldown.add(message.author.id);
      setTimeout(() => xpCooldown.delete(message.author.id), 5000);
    }
  },
};
