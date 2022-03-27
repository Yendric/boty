import { Message, MessageEmbed } from "discord.js";
import { getUser } from "../utils/database";

const xpCooldown = new Set();

export default {
  name: "messageCreate",
  async execute(message: Message) {
    if (message.author.bot) return;
    if (message.channel.type == "DM") return;
    if (!message.guild) return;

    if (!xpCooldown.has(message.author.id)) {
      const user = await getUser(message.author.id);
      const randomXp = Math.floor(Math.random() * 13) + 1;

      user.increment("messages");
      user.increment("xp", { by: randomXp });

      const userLevel = user.get("level");
      const userXp = user.get("xp");
      const nextLevelXp = userLevel ** 2 * 300;

      if (userXp >= nextLevelXp) {
        user.increment("level");
        message.channel.send({
          embeds: [
            new MessageEmbed()
              .setAuthor("Level up!")
              .setColor("#33AAFF")
              .setThumbnail(message.author.displayAvatarURL())
              .setDescription(`Nieuw level: **${userLevel + 1}**`)
              .setFooter("Woop Woop!"),
          ],
        });
      }
      xpCooldown.add(message.author.id);
      setTimeout(() => xpCooldown.delete(message.author.id), 5000);
    }
  },
};
