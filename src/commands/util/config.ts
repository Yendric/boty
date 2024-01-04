import Client from "@/classes/Client";
import GuildCommand from "@/classes/GuildCommand";
import Guild from "@/models/Guild";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Toont de huidige server configuratie.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    async execute(_, interaction) {
        const settings = await new Guild(interaction.guild.id).fetch();
        interaction.reply({
            embeds: [
                Client.embed()
                    .setTitle("De huidige server configuratie")
                    .addFields(
                        Object.entries(settings)
                            .filter(([key]) => !["id", "createdAt", "updatedAt"].includes(key))
                            .map(([key, value]) => ({
                                inline: true,
                                name: key,
                                value: value?.toString() ?? "*(niet ingesteld)*",
                            }))
                    ),
            ],
        });
    },
});
