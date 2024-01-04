import Client from "@/classes/Client";
import GuildCommand from "@/classes/GuildCommand";
import { SlashCommandBuilder } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder().setName("info").setDescription("Info over de discord server."),
    async execute(client, interaction) {
        await interaction.reply({
            embeds: [
                Client.embed()
                    .setTitle(interaction.guild.name + " | Info")
                    .addFields([
                        { name: "Leden:", value: `${interaction.guild.memberCount}`, inline: true },
                        {
                            name: "Bots:",
                            value: `${interaction.guild.members.cache.filter((member) => member.user.bot)?.size}`,
                            inline: true,
                        },

                        {
                            name: "Mensen:",
                            value: `${interaction.guild.members.cache.filter((member) => !member.user.bot)?.size}`,
                            inline: true,
                        },
                        {
                            name: "Online mensen:",
                            value: `${
                                interaction.guild.members.cache.filter(
                                    (member) =>
                                        !member.user.bot && (member?.presence?.status ?? "offline") !== "offline"
                                )?.size
                            }`,
                            inline: true,
                        },
                        {
                            name: "Offline mensen:",
                            value: `${
                                interaction.guild.members.cache.filter(
                                    (member) => !member.user.bot && (member?.presence?.status ?? "offline") == "offline"
                                )?.size
                            }`,
                            inline: true,
                        },
                        {
                            name: "Gemaakt op:",
                            value: `${interaction.guild.createdAt.toLocaleString()}`,
                            inline: true,
                        },
                        {
                            name: "Eigenaar:",
                            value: `${interaction.guild.members.cache.get(interaction.guild.ownerId)}`,
                            inline: true,
                        },
                    ])
                    .setThumbnail(interaction.guild.iconURL())
                    .setFooter({ text: "Opgevraagd door " + interaction.member.user.username }),
            ],
        });
    },
});
