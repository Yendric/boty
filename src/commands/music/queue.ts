import { ActionRowBuilder, ButtonBuilder, ButtonStyle, GuildMember, SlashCommandBuilder } from "discord.js";
import { MusicRegistry, Song } from "@/services/Music";
import GuildCommand from "@/classes/GuildCommand";
import Client from "@/classes/Client";

enum ButtonId {
    Skip = "skip",
    Stop = "stop",
}

const buttons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(new ButtonBuilder().setCustomId(ButtonId.Skip).setLabel("Skip liedje").setStyle(ButtonStyle.Primary))
    .addComponents(new ButtonBuilder().setCustomId(ButtonId.Stop).setLabel("Stop muziek").setStyle(ButtonStyle.Danger));

export default new GuildCommand({
    data: new SlashCommandBuilder().setName("queue").setDescription("Bekijk de wachtrij."),
    async execute(_, interaction) {
        const musicPlayer = MusicRegistry.getInstance(interaction.guild);

        if (!musicPlayer) return interaction.reply("Er is geen muziek aan het spelen.");
        if (interaction.member.voice?.channel !== musicPlayer.getVoiceChannel())
            return interaction.reply("Je bent geen muziek aan het luisteren!");

        const queueMessage = await interaction.reply({
            embeds: [generateEmbed(musicPlayer.getSongs())],
            components: [buttons],
            fetchReply: true,
        });

        const collector = queueMessage.createMessageComponentCollector({
            time: 60000,
        });

        collector.on("collect", async (buttonInteraction) => {
            const musicPlayer = MusicRegistry.getInstance(interaction.guild);
            const clickedFromChannel = (buttonInteraction.member as GuildMember)?.voice?.channel;

            if (!musicPlayer || clickedFromChannel !== musicPlayer.getVoiceChannel()) {
                buttonInteraction.reply({ content: "Je bent geen muziek aan het luisteren!", ephemeral: true });
                return;
            }

            if (buttonInteraction.customId === ButtonId.Skip) {
                musicPlayer.skip();
                const songs = musicPlayer.getSongs();

                buttonInteraction.update({
                    embeds: [generateEmbed(songs)],
                    components: songs.length ? [buttons] : [],
                    content: "Liedje geskipt.",
                });
            } else if (buttonInteraction.customId === ButtonId.Stop) {
                musicPlayer.destroy();
                buttonInteraction.update({ content: "Muziek gestopt.", components: [], embeds: [generateEmbed([])] });
            }
        });

        collector.on("end", async (interaction) => {
            await queueMessage.edit({ components: [] });
        });
    },
});

function generateEmbed(songs: readonly Song[]) {
    const embed = Client.embed()
        .setTitle("Queue")
        .addFields(
            songs.map((song, index) => ({
                name: index == 0 ? `Nu speelt: **${song.title}**` : `${index}. **${song.title}**`,
                value: song.url,
            }))
        );

    if (!songs.length) embed.setDescription("De queue is nu leeg.");

    return embed;
}
