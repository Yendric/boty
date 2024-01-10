import Client from "@/classes/Client";
import { getEnvVariable } from "@/utils/environment";
import { htmlDecode } from "@/utils/string";
import {
    AudioPlayer,
    AudioPlayerStatus,
    StreamType,
    VoiceConnection,
    VoiceConnectionStatus,
    createAudioPlayer,
    createAudioResource,
    entersState,
    joinVoiceChannel,
} from "@discordjs/voice";
import { Guild, Snowflake, TextChannel, VoiceBasedChannel } from "discord.js";
import search from "youtube-search";
import ytdl from "ytdl-core";

export interface Song {
    title: string;
    url: string;
    thumbnail?: string;
}

export class MusicRegistry {
    static registry: Map<Snowflake, MusicPlayer> = new Map();

    static getInstance(guild: Guild) {
        return this.registry.get(guild.id);
    }

    static createInstance(guild: Guild, voiceChannel: VoiceBasedChannel, textChannel: TextChannel) {
        const instance = new MusicPlayer(guild, voiceChannel, textChannel);
        this.registry.set(guild.id, instance);
        return instance;
    }

    static getOrCreate(guild: Guild, voiceChannel: VoiceBasedChannel, textChannel: TextChannel) {
        return this.getInstance(guild) ?? this.createInstance(guild, voiceChannel, textChannel);
    }

    static destroyInstance(guild: Guild) {
        return this.registry.delete(guild.id);
    }
}

export class MusicPlayer {
    private textChannel: TextChannel;
    private songs: Song[] = [];
    private connection: VoiceConnection;
    private player: AudioPlayer;
    private isLooping = false;

    public constructor(guild: Guild, voiceChannel: VoiceBasedChannel, textChannel: TextChannel) {
        this.textChannel = textChannel;
        this.connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });
        this.player = createAudioPlayer();

        this.connection.subscribe(this.player);

        this.player.on(AudioPlayerStatus.Idle, () => {
            if (!this.isLooping) this.songs.shift();

            this.play();
        });

        this.connection.on(VoiceConnectionStatus.Disconnected, async (_old, _new) => {
            try {
                // Check if we were moved to a different channel
                await Promise.race([
                    entersState(this.connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
            } catch (error) {
                // We were disconnected :(
                this.destroy();
            }
        });
    }

    public async addSong(song: Song) {
        this.songs.push(song);

        if (this.player.state.status === AudioPlayerStatus.Idle) {
            this.play();
        }
    }

    public getSongs() {
        return Object.freeze([...this.songs]); // Prevent the original array from being modified
    }

    public getVoiceChannel() {
        return this.textChannel.guild.members.me?.voice.channel;
    }

    public getTextChannel() {
        return this.textChannel;
    }

    public play() {
        if (!this.songs[0]) return this.destroy();
        const song = this.songs[0];
        const stream = ytdl(song.url, {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1048576 * 32, // 32MB buffer
        });
        const resource = createAudioResource(stream, {
            inputType: StreamType.Arbitrary,
        });
        this.player.play(resource);

        this.textChannel.send({
            embeds: [
                Client.embed()
                    .setTitle(`Nu speelt: **${song.title}**`)
                    .setDescription(song.url)
                    .setThumbnail(song.thumbnail ?? null),
            ],
        });
    }

    public pause() {
        this.player.pause();
    }

    public resume() {
        this.player.unpause();
    }

    public toggleLooping() {
        this.isLooping = !this.isLooping;
    }

    public getLooping() {
        return this.isLooping;
    }

    public destroy() {
        this.songs = [];
        this.connection.destroy();
        this.player.stop();

        MusicRegistry.destroyInstance(this.textChannel.guild);
    }

    public skip() {
        this.player.stop();
    }

    public async fetchSongs(queryOrUrl: string): Promise<Song[]> {
        if (ytdl.validateURL(queryOrUrl)) {
            const songInfo = await ytdl.getInfo(queryOrUrl);
            return [
                {
                    title: htmlDecode(songInfo.videoDetails.title),
                    url: songInfo.videoDetails.video_url,
                    thumbnail: songInfo.videoDetails.thumbnails[0]?.url,
                },
            ];
        } else {
            const { results } = await search(queryOrUrl, {
                type: "video",
                maxResults: 3, // This isn't always respected, so we slice the array later
                key: getEnvVariable("YOUTUBE_API_KEY"),
            });

            return results.slice(0, 3).map((song) => ({
                title: htmlDecode(song.title),
                url: song.link,
                thumbnail: song.thumbnails.default?.url,
            }));
        }
    }
}
