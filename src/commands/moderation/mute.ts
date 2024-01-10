import GuildCommand from "@/classes/GuildCommand";
import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import ms from "ms";

export default new GuildCommand({
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute een gebruiker.")
        .addUserOption((option) =>
            option.setName("target").setDescription("Wie moet er gemuted worden?").setRequired(true),
        )
        .addStringOption((option) => option.setName("duration").setDescription("Hoe lang?").setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(_, interaction) {
        if (!interaction.guild.members.me?.permissionsIn(interaction.channel).has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply("Ik heb hier geen toestemming voor.");

        const target = interaction.options.getMember("target") as GuildMember | null;
        if (!target) return interaction.reply("Geen gebruiker opgegeven.");
        const duration = ms(interaction.options.getString("duration") ?? "1m");

        await target.timeout(duration);
        await interaction.reply({ content: `${target} is nu gemuted.` });
    },
});
