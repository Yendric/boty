import Client from "@/classes/Client";
import GuildCommand from "@/classes/GuildCommand";
import { MusicPlayer, MusicRegistry, Song } from "@/services/Music";
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    GuildMember,
    MessageFlags,
    SlashCommandBuilder,
} from "discord.js";

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
        if (interaction.member.voice.channel !== musicPlayer.getVoiceChannel())
            return interaction.reply("Je bent geen muziek aan het luisteren!");

        const queueMessage = await interaction.reply({
            embeds: [generateEmbed(musicPlayer.getSongs(), musicPlayer)],
            components: [buttons],
        });

        const collector = queueMessage.createMessageComponentCollector({
            time: 60000,
        });

        collector.on("collect", async (buttonInteraction) => {
            const musicPlayer = MusicRegistry.getInstance(interaction.guild);
            const clickedFromChannel =
                buttonInteraction.member instanceof GuildMember ? buttonInteraction.member.voice.channel : null;

            if (!musicPlayer || clickedFromChannel !== musicPlayer.getVoiceChannel()) {
                await buttonInteraction.reply({
                    content: "Je bent geen muziek aan het luisteren!",
                    flags: MessageFlags.Ephemeral,
                });
                return;
            }

            if (buttonInteraction.customId === ButtonId.Skip) {
                musicPlayer.skip();
                const songs = musicPlayer.getSongs();

                await buttonInteraction.update({
                    embeds: [generateEmbed(songs, musicPlayer)],
                    components: songs.length ? [buttons] : [],
                    content: "Liedje geskipt.",
                });
            } else if (buttonInteraction.customId === ButtonId.Stop) {
                musicPlayer.destroy();
                await buttonInteraction.update({
                    content: "Muziek gestopt.",
                    components: [],
                    embeds: [generateEmbed([], musicPlayer)],
                });
            }
        });

        collector.on("end", async () => {
            await interaction.editReply({ components: [] }).catch(() => undefined);
        });
    },
});

function generateEmbed(songs: readonly Song[], musicPlayer: MusicPlayer) {
    const embed = Client.embed()
        .setTitle("Wachtrij")
        .addFields(
            songs.map((song, index) => ({
                name:
                    index == 0
                        ? `Nu speelt${loopStatus(musicPlayer)}: **${song.title}** `
                        : `${index}. **${song.title}**`,
                value: song.url,
            })),
        );

    if (!songs.length) embed.setDescription("De wachtrij is nu leeg.");

    return embed;
}

function loopStatus(musicPlayer: MusicPlayer) {
    return musicPlayer.getLooping() ? " [LOOP!]" : "";
}
