import Client from "@/classes/Client";
import GuildCommand from "@/classes/GuildCommand";
import { MusicRegistry, Song } from "@/services/Music";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, SlashCommandBuilder } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder()
        .setName("play")
        .setDescription("Speel een liedje.")
        .addStringOption((option) =>
            option.setName("liedje").setDescription("Welk liedje moet er gespeeld worden?").setRequired(true),
        ),
    async execute(_, interaction) {
        const voiceChannel = interaction.member.voice.channel;
        if (!voiceChannel) {
            return interaction.reply({ content: "Je moet in een voicechannel zitten!", flags: MessageFlags.Ephemeral });
        }
        if (!interaction.channel.isTextBased()) {
            return interaction.reply({
                content: "Dit commando werkt alleen in een tekstkanaal.",
                flags: MessageFlags.Ephemeral,
            });
        }

        await interaction.deferReply();

        const textChannel = interaction.channel;
        const songs = await MusicRegistry.fetchSongs(interaction.options.getString("liedje", true));

        if (songs.length === 0) return interaction.editReply("Geen liedjes gevonden!");

        const addSong = (song: Song) =>
            MusicRegistry.getOrCreate(interaction.guild, voiceChannel, textChannel).addSong(song);

        if (songs.length === 1 && songs[0]) {
            await interaction.editReply({ embeds: [generateSelectedEmbed(songs[0])] });
            return addSong(songs[0]);
        }

        const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
            ...songs.map((_, index) =>
                new ButtonBuilder()
                    .setCustomId(`song-${index}`)
                    .setLabel((index + 1).toString())
                    .setStyle(ButtonStyle.Primary),
            ),
            new ButtonBuilder().setCustomId("cancel").setLabel("❌").setStyle(ButtonStyle.Danger),
        );

        const songsMessage = await interaction.editReply({
            embeds: [
                Client.embed()
                    .setTitle(`${songs.length} liedjes gevonden!`)
                    .setDescription("Kies een liedje om te spelen.")
                    .addFields(
                        songs.map((song, index) => ({ name: `**${index + 1}.** ${song.title}`, value: song.url })),
                    ),
            ],
            components: [buttons],
        });

        const collector = songsMessage.createMessageComponentCollector({
            filter: (buttonInteraction) => buttonInteraction.user.id === interaction.user.id,
            time: 10000,
        });

        collector.on("collect", async (buttonInteraction) => {
            if (buttonInteraction.customId === "cancel") {
                await buttonInteraction.deferUpdate();
                return collector.stop("cancelled");
            }

            const songIndex = parseInt(buttonInteraction.customId.split("-")[1] ?? "-1");
            const song = songs[songIndex];
            if (!song) return;

            await buttonInteraction.update({
                embeds: [generateSelectedEmbed(song)],
                components: [],
            });

            await addSong(song);
        });

        collector.on("end", async (collected, reason) => {
            if (collected.size === 0 || reason === "cancelled") {
                await interaction
                    .editReply({
                        components: [],
                        embeds: [generateSelectedEmbed()],
                    })
                    .catch(() => undefined);
            }
        });
    },
});

function generateSelectedEmbed(song: Song | undefined = undefined) {
    if (!song) return Client.embed().setTitle("Kies een liedje").setDescription("Er werd geen liedje gekozen.");

    return Client.embed()
        .setTitle(`Toegevoegd aan wachtrij: **${song.title}**`)
        .setDescription(song.url)
        .setThumbnail(song.thumbnail ?? null);
}
