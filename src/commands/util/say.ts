import GuildCommand from "@/classes/GuildCommand";
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Laat de bot iets zeggen.")
        .addStringOption((option) =>
            option.setName("message").setDescription("Wat wil je me laten zeggen?").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(_, interaction) {
        const message = interaction.options.getString("message");
        if (!message) return;

        await interaction.reply({ content: "Actie wordt uitgevoerd...", ephemeral: true });
        await interaction.channel.send(message);
    },
});
