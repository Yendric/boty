import GuildCommand from "@/classes/GuildCommand";
import { MusicRegistry } from "@/services/Music";
import { SlashCommandBuilder } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder().setName("skip").setDescription("Skip de wachtrij."),
    async execute(_, interaction) {
        const musicPlayer = MusicRegistry.getInstance(interaction.guild);

        if (!musicPlayer) return interaction.reply("Er is geen muziek aan het spelen.");
        if (interaction.member.voice?.channel !== musicPlayer.getVoiceChannel())
            return interaction.reply("Je bent geen muziek aan het luisteren!");

        musicPlayer.skip();
        interaction.reply("Liedje geskipt.");
    },
});
