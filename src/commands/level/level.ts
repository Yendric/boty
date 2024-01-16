import Client from "@/classes/Client";
import GuildCommand from "@/classes/GuildCommand";
import User from "@/models/User";
import { generateProgressBar } from "@/utils/string";
import { GuildMember, SlashCommandBuilder } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder()
        .setName("level")
        .setDescription("Bekijk het level van een gebruiker.")
        .addUserOption((option) =>
            option
                .setName("member")
                .setDescription("Van wie wil je het level bekijken? (Standaard: jij)")
                .setRequired(false),
        ),
    async execute(_, interaction) {
        const requestedMember = interaction.options.getMember("member") as GuildMember | null;
        const member: GuildMember = requestedMember ?? interaction.member;

        const levelData = await new User(member.id).getLevelData();

        const levelEmbed = Client.embed()
            .setTitle(`Level info van ${member.displayName}`)
            .setDescription(
                `Level: **${levelData.level}**
XP: **${levelData.xp}**
Berichten verzonden: **${levelData.messages}**`,
            )
            .setThumbnail(member.user.displayAvatarURL())
            .setFooter({
                text: `Progress: ${levelData.level} ${generateProgressBar(levelData.progress, 15)} ${
                    levelData.level + 1
                }`,
            });

        await interaction.reply({ embeds: [levelEmbed] });
    },
});
