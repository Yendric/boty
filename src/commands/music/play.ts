import Client from "@/classes/Client";
import GuildCommand from "@/classes/GuildCommand";
import { MusicRegistry, Song } from "@/services/Music";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, TextChannel } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Speel een liedje.")
        .addStringOption((option) =>
            option.setName("liedje").setDescription("Welk liedje moet er gespeeld worden?").setRequired(true)
        ),
    async execute(_, interaction) {
        const voiceChannel = interaction.member.voice?.channel;
        if (!voiceChannel) return interaction.reply("Je moet in een voicechannel zitten!");

        const musicPlayer = MusicRegistry.getOrCreate(
            interaction.guild,
            voiceChannel,
            interaction.channel as TextChannel
        );

        const searchQueryOrURI = interaction.options.getString("liedje");
        const songs = await musicPlayer.fetchSongs(searchQueryOrURI ?? "");
        if (songs.length === 0) return interaction.reply("Geen liedjes gevonden!");

        if (songs.length === 1 && songs[0]) {
            await interaction.reply({
                embeds: [generateSelectedEmbed(songs[0])],
                components: [],
            });

            return await musicPlayer.addSong(songs[0]);
        }

        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            ...songs.map((_, index) =>
                new ButtonBuilder()
                    .setCustomId(`song-${index}`)
                    .setLabel((index + 1).toString())
                    .setStyle(ButtonStyle.Primary)
            ),
            new ButtonBuilder().setCustomId("cancel").setLabel("❌").setStyle(ButtonStyle.Danger)
        );

        const songsMessage = await interaction.reply({
            embeds: [
                Client.embed()
                    .setTitle(`${songs.length} liedjes gevonden!`)
                    .setDescription("Kies een liedje om te spelen.")
                    .addFields(
                        songs.map((song, index) => ({ name: `**${index + 1}.** ${song.title}`, value: song.url }))
                    ),
            ],
            components: [buttons],
            fetchReply: true,
        });

        const collector = songsMessage.createMessageComponentCollector({
            filter: (buttonInteraction) => buttonInteraction.user.id === interaction.user.id,
            time: 10000,
        });

        collector.on("collect", async (buttonInteraction) => {
            if (buttonInteraction.customId === "cancel") {
                return collector.stop("cancelled");
            }

            const songIndex = parseInt(buttonInteraction.customId.split("-")[1] ?? "-1");
            const song = songs[songIndex];
            if (!song) return;

            await buttonInteraction.update({
                embeds: [generateSelectedEmbed(song)],
                components: [],
            });

            await musicPlayer.addSong(song);
        });

        collector.on("end", async (collected, reason) => {
            if (collected.size === 0 || reason === "cancelled") {
                await interaction.editReply({
                    components: [],
                    embeds: [generateSelectedEmbed()],
                });
            }
        });
    },
});

function generateSelectedEmbed(song: Song | undefined = undefined) {
    if (!song) return Client.embed().setTitle("Kies een liedje").setDescription("Er werd geen liedje gekozen.");

    return Client.embed()
        .setTitle(`Toegevoegd aan wachtrij: **${song.title}**`)
        .setDescription(song.url)
        .setThumbnail(song.thumbnail ?? "");
}
