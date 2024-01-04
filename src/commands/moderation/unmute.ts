import { GuildMember, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import GuildCommand from "@/classes/GuildCommand";

export default new GuildCommand({
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Unmute een gebruiker.")
        .addUserOption((option) =>
            option.setName("target").setDescription("Wie moet er niet meer gemuted zijn?").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    async execute(_, interaction) {
        if (!interaction.guild.members.me?.permissionsIn(interaction.channel).has(PermissionFlagsBits.ModerateMembers))
            return interaction.reply("Ik heb hier geen toestemming voor.");

        const target = interaction.options.getMember("target") as GuildMember | null;
        if (!target) return interaction.reply("Geen gebruiker opgegeven.");

        await target.timeout(null);
        await interaction.reply({ content: `${target} kan weer praten.` });
    },
});
