import GuildCommand from "@/classes/GuildCommand";
import { GuildMember, MessageFlags, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import ms, { StringValue } from "ms";

const MAX_TIMEOUT_MS = 28 * 24 * 60 * 60 * 1000;

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

        const target = interaction.options.getMember("target");
        if (!(target instanceof GuildMember)) return interaction.reply("Geen gebruiker opgegeven.");

        const duration = ms(interaction.options.getString("duration", true) as StringValue);
        if (!duration || duration <= 0 || duration > MAX_TIMEOUT_MS) {
            return interaction.reply({
                content: "Ongeldige duur. Gebruik bijvoorbeeld `10m`, `1h` of `7d` (maximaal 28 dagen).",
                flags: MessageFlags.Ephemeral,
            });
        }

        await target.timeout(duration);
        await interaction.reply({ content: `${target} is nu gemuted.` });
    },
});
