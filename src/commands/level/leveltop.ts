import Client from "@/classes/Client";
import GuildCommand from "@/classes/GuildCommand";
import { prisma } from "@/db/db";
import User from "@/models/User";
import { SlashCommandBuilder } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder().setName("leveltop").setDescription("Toont de beste gamers."),
    async execute(_, interaction) {
        const points = await prisma.user.findMany({
            take: 10,
            orderBy: {
                xp: "desc",
            },
        });

        const embed = Client.embed()
            .setTitle("Leveltop")
            .setDescription("Top 10 gamers in alle Boty servers!")
            .addFields(
                await Promise.all(
                    points.map(async (user, index) => ({
                        name: `#${index + 1}`,
                        value: `<@${user.id}>: ${user.xp} XP (level ${(await new User(user.id).getLevelData()).level})`,
                    }))
                )
            );

        return interaction.reply({ embeds: [embed] });
    },
});
