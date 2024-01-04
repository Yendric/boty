import Client from "@/classes/Client";
import GuildCommand from "@/classes/GuildCommand";
import ModerationService from "@/services/Moderation";
import { MessageType } from "@/types";
import { PermissionFlagsBits, SlashCommandBuilder, Snowflake } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban een gebruiker.")
        .addStringOption((option) =>
            option.setName("snowflake").setDescription("Wie moet er geunbanned worden? (snowflake)").setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(client, interaction) {
        if (!interaction.guild.members.me?.permissionsIn(interaction.channel).has(PermissionFlagsBits.BanMembers))
            return interaction.reply("Ik heb hier geen toestemming voor.");

        const target = await client.users.fetch(interaction.options.getString("snowflake") as Snowflake);
        if (!target) return interaction.reply("Gelieve een snowflake op te geven");

        const banList = interaction.guild.bans.cache;
        const bannedUser = banList.find((guildBan) => guildBan.user.id === target.id);
        if (!bannedUser) return interaction.reply(`${target} is niet verbannen.`);

        const bannedEmbed = Client.embed(MessageType.Success).setDescription(
            `**Unbanned: ${target}**
			**Door:** ${interaction.member}`
        );

        ModerationService.generateModerationInstructions(interaction, `Wil je ${target} unbannen?`, async () => {
            await interaction.guild.members.unban(target);
            await interaction.followUp({ embeds: [bannedEmbed] });
        });
    },
});
