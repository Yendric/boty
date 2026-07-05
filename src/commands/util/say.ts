import GuildCommand from "@/classes/GuildCommand";
import Logger from "@/services/Logger";
import { MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Laat de bot iets zeggen.")
        .addStringOption((option) =>
            option.setName("message").setDescription("Wat wil je me laten zeggen?").setRequired(true),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(_, interaction) {
        const message = interaction.options.getString("message", true);
        if (!interaction.channel.isSendable()) {
            return interaction.reply({ content: "Ik kan hier geen bericht sturen.", flags: MessageFlags.Ephemeral });
        }

        await interaction.reply({ content: "Actie wordt uitgevoerd...", flags: MessageFlags.Ephemeral });
        await interaction.channel.send(message);
        Logger.info(
            `[SAY] "${interaction.user.username}" in "${interaction.channel.name}" (${interaction.guild.name}): "${message}"`,
        );
    },
});
