import Client from "@/classes/Client";
import GuildCommand from "@/classes/GuildCommand";
import { MessageType } from "@/types";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("Verwijder een aantal berichten.")
        .addIntegerOption((option) =>
            option
                .setName("amount")
                .setDescription("Hoeveel berichten wil je verwijderen ?")
                .setMinValue(1)
                .setMaxValue(99)
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(_, interaction) {
        const amount = interaction.options.getInteger("amount");
        if (!amount || amount < 1 || amount > 99) return interaction.reply("Kies een getal van 1 tot 99!");

        try {
            await interaction.channel.bulkDelete(amount);
            await interaction.reply({
                embeds: [
                    Client.embed(MessageType.Success).setDescription(
                        `${amount} ${amount == 1 ? "bericht" : "berichten"} verwijderd.`
                    ),
                ],
            });
            setTimeout(() => interaction.deleteReply(), 5000);
        } catch (err) {
            await interaction.reply({
                embeds: [
                    Client.embed(MessageType.Error).setDescription(
                        "Er is iets misgegaan (zijn er berichten ouder dan 14 dagen?)."
                    ),
                ],
            });
            setTimeout(() => interaction.deleteReply(), 5000);
        }
    },
});
