import Client from "@/classes/Client";
import GuildCommand from "@/classes/GuildCommand";
import ModerationService from "@/services/Moderation";
import { MessageType } from "@/types";
import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Verban een gebruiker.")
        .addUserOption((option) =>
            option.setName("target").setDescription("Wie moet er verbannen worden?").setRequired(true)
        )
        .addStringOption((option) => option.setName("reden").setDescription("Wat is de reden?").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(client, interaction) {
        if (!interaction.guild.members.me?.permissionsIn(interaction.channel).has(PermissionFlagsBits.BanMembers))
            return interaction.reply("Ik heb hier geen toestemming voor.");

        const target = interaction.options.getMember("target") as GuildMember | null;
        if (!target) return interaction.reply("Geen gebruiker opgegeven.");
        const reason = interaction.options.getString("reden") || "Geen reden opgegeven.";

        const bannedEmbed = Client.embed(MessageType.Error).setDescription(
            `**Verbannen: ${target}**
            **Door:** ${interaction.member}
            **Reden:** ${reason}`
        );

        ModerationService.generateModerationInstructions(interaction, `Wil je ${target} verbannen?`, async () => {
            await target.ban({ reason });
            await interaction.followUp({ embeds: [bannedEmbed] });
        });
    },
});
