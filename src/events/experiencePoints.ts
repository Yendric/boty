import { ChannelType, Snowflake } from "discord.js";
import EventHandler from "@/classes/EventHandler";
import Client from "@/classes/Client";
import User from "@/models/User";
import { calculateLevelFromXp } from "@/utils/levels";

const xpCooldown: Set<Snowflake> = new Set();

export default new EventHandler({
    event: "messageCreate",
    async execute(_, [message]) {
        if (message.author.bot || !message.guild || message.channel.type == ChannelType.DM) return;
        if (xpCooldown.has(message.author.id)) return;

        const user = new User(message.author.id);
        const { xp } = await user.fetch();

        const oldLevel = calculateLevelFromXp(xp);
        const randomXp = Math.floor(Math.random() * 13) + 1;
        await user.incrementMessages();
        await user.incrementXp(randomXp); // Random number in [1,13]
        const newLevel = calculateLevelFromXp(xp + randomXp);

        if (oldLevel != newLevel) {
            message.channel.send({
                embeds: [
                    Client.embed()
                        .setTitle("Level up!")
                        .setThumbnail(message.author.displayAvatarURL())
                        .setDescription(`Nieuw level: **${newLevel}**`)
                        .setFooter({ text: "Woop Woop!" }),
                ],
            });
        }

        xpCooldown.add(message.author.id);
        setTimeout(() => xpCooldown.delete(message.author.id), 5000);
    },
});
