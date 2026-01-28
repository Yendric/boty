import Client from "@/classes/Client";
import {
    AudioPlayer,
    AudioPlayerStatus,
    DiscordGatewayAdapterCreator,
    StreamType,
    VoiceConnection,
    VoiceConnectionStatus,
    createAudioPlayer,
    createAudioResource,
    entersState,
    joinVoiceChannel,
} from "@discordjs/voice";
import { Guild, Snowflake, TextChannel, VoiceBasedChannel } from "discord.js";
import { Readable } from "stream";
import Innertube, { UniversalCache } from "youtubei.js";

export interface Song {
    title: string;
    url: string;
    id: string;
    thumbnail?: string;
    duration?: string;
}

export class MusicRegistry {
    static registry: Map<Snowflake, MusicPlayer> = new Map();
    static youtubeClient: Innertube | null = null;

    static async getYoutubeClient() {
        if (!this.youtubeClient) {
            this.youtubeClient = await Innertube.create({
                cache: new UniversalCache(false),
                generate_session_locally: true
            });
        }
        return this.youtubeClient;
    }

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
            adapterCreator: guild.voiceAdapterCreator as unknown as DiscordGatewayAdapterCreator,
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
        return Object.freeze([...this.songs]);
    }

    public getVoiceChannel() {
        return this.textChannel.guild.members.me?.voice.channel;
    }

    public getTextChannel() {
        return this.textChannel;
    }

    public async play() {
        if (!this.songs[0]) return this.destroy();
        const song = this.songs[0];
        try {
            const yt = await MusicRegistry.getYoutubeClient();

            const stream = await yt.download(song.id, {
                type: 'audio',
                quality: 'best',
                format: 'mp4',
                client: 'ANDROID' // bypasses age gating better than web
            });

            const nodeStream = Readable.fromWeb(stream as any);

            const resource = createAudioResource(nodeStream, {
                inputType: StreamType.Arbitrary,
                inlineVolume: true
            });

            this.player.play(resource);

            this.textChannel.send({
                embeds: [
                    Client.embed()
                        .setTitle(`Nu speelt: **${song.title}**`)
                        .setDescription(song.url)
                        .setThumbnail(song.thumbnail ?? null)
                        .setFooter({ text: `Duur: ${song.duration}` })
                ],
            });
        } catch (error) {
            console.error("Play error:", error);
            this.textChannel.send(`Afspelen van **${song.title}** mislukt. Overslaan...`);
            this.songs.shift();
            this.play();
        }
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
        const yt = await MusicRegistry.getYoutubeClient();

        try {
            if (queryOrUrl.includes("youtube.com/watch") || queryOrUrl.includes("youtu.be/")) {
                const videoId = queryOrUrl.split('v=')[1]?.split('&')[0] || queryOrUrl.split('/').pop();
                if (!videoId) throw new Error("Invalid ID");

                const info = await yt.getBasicInfo(videoId);

                return [{
                    title: info.basic_info.title || "Unknown",
                    url: `https://www.youtube.com/watch?v=${info.basic_info.id}`,
                    id: info.basic_info.id as string,
                    thumbnail: info.basic_info.thumbnail?.[0]?.url,
                    duration: info.basic_info.duration ? String(info.basic_info.duration) : "N/A"
                }];
            }
            else {
                const searchResult = await yt.search(queryOrUrl, { type: 'video' });

                const videos = searchResult.videos.slice(0, 3);

                return videos.map((vid: any) => ({
                    title: vid.title.text || "Unknown",
                    url: `https://www.youtube.com/watch?v=${vid.id}`,
                    id: vid.id,
                    thumbnail: vid.thumbnails[0]?.url,
                    duration: vid.duration?.text || "N/A"
                }));
            }
        } catch (e) {
            console.error("Fetch Error:", e);
            return [];
        }
    }
}
