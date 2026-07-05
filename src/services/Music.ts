import Client from "@/classes/Client";
import Logger from "@/services/Logger";
import {
    AudioPlayer,
    AudioPlayerStatus,
    createAudioPlayer,
    createAudioResource,
    demuxProbe,
    entersState,
    joinVoiceChannel,
    VoiceConnection,
    VoiceConnectionStatus,
} from "@discordjs/voice";
import { Guild, GuildTextBasedChannel, Snowflake, VoiceBasedChannel } from "discord.js";
import { ChildProcessByStdio, spawn } from "node:child_process";
import { Readable } from "node:stream";
import Innertube, { UniversalCache, YTNodes } from "youtubei.js";

export interface Song {
    title: string;
    url: string;
    id: string;
    thumbnail?: string;
    duration?: string;
}

export class MusicRegistry {
    private static registry = new Map<Snowflake, MusicPlayer>();
    private static youtubeClient: Promise<Innertube> | null = null;

    /** YouTube-client voor zoeken en metadata. Audio via yt-dlp */
    static getYoutubeClient(): Promise<Innertube> {
        // Mislukte creatie niet cachen
        this.youtubeClient ??= Innertube.create({ cache: new UniversalCache(false) }).catch((error) => {
            this.youtubeClient = null;
            throw error;
        });
        return this.youtubeClient;
    }

    static getInstance(guild: Guild) {
        return this.registry.get(guild.id);
    }

    static createInstance(guild: Guild, voiceChannel: VoiceBasedChannel, textChannel: GuildTextBasedChannel) {
        const instance = new MusicPlayer(guild, voiceChannel, textChannel);
        this.registry.set(guild.id, instance);
        return instance;
    }

    static getOrCreate(guild: Guild, voiceChannel: VoiceBasedChannel, textChannel: GuildTextBasedChannel) {
        return this.getInstance(guild) ?? this.createInstance(guild, voiceChannel, textChannel);
    }

    static destroyInstance(guild: Guild) {
        return this.registry.delete(guild.id);
    }

    static destroyAll() {
        for (const player of this.registry.values()) {
            player.destroy();
        }
    }

    static async fetchSongs(queryOrUrl: string): Promise<Song[]> {
        try {
            const youtube = await this.getYoutubeClient();

            const videoId = extractVideoId(queryOrUrl);
            if (videoId) {
                const info = await youtube.getBasicInfo(videoId);
                if (!info.basic_info.id) return [];

                return [
                    {
                        title: info.basic_info.title ?? "Onbekend",
                        url: `https://www.youtube.com/watch?v=${info.basic_info.id}`,
                        id: info.basic_info.id,
                        thumbnail: info.basic_info.thumbnail?.[0]?.url,
                        duration: formatDuration(info.basic_info.duration),
                    },
                ];
            }

            const searchResult = await youtube.search(queryOrUrl, { type: "video" });
            return searchResult.videos
                .filter((video): video is YTNodes.Video => video.is(YTNodes.Video))
                .slice(0, 3)
                .map((video) => ({
                    title: video.title.text ?? "Onbekend",
                    url: `https://www.youtube.com/watch?v=${video.video_id}`,
                    id: video.video_id,
                    thumbnail: video.thumbnails[0]?.url,
                    duration: video.duration?.text,
                }));
        } catch (error) {
            Logger.error(`Zoeken naar "${queryOrUrl}" mislukt: ${error instanceof Error ? error.message : error}`);
            return [];
        }
    }
}

export class MusicPlayer {
    private textChannel: GuildTextBasedChannel;
    private songs: Song[] = [];
    private connection: VoiceConnection;
    private player: AudioPlayer;
    private isLooping = false;
    private destroyed = false;
    /** Wordt opgehoogd bij elke play()/destroy() zodat verouderde downloads zichzelf afbreken. */
    private loadToken = 0;
    private isLoading = false;
    private downloadProcess: ChildProcessByStdio<null, Readable, Readable> | null = null;

    public constructor(guild: Guild, voiceChannel: VoiceBasedChannel, textChannel: GuildTextBasedChannel) {
        this.textChannel = textChannel;
        this.connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: guild.id,
            adapterCreator: guild.voiceAdapterCreator,
        });
        this.player = createAudioPlayer();
        this.connection.subscribe(this.player);

        this.player.on(AudioPlayerStatus.Idle, () => {
            // Idle van een verouderde/kapotte stream tijdens het laden: play() handelt dat zelf af.
            if (this.destroyed || this.isLoading) return;
            if (!this.isLooping) this.songs.shift();
            void this.play();
        });
        this.player.on("error", (error) => {
            Logger.error(`Audiospeler: ${error.message}`);
        });
        this.connection.on("error", (error) => {
            // Alleen loggen: de state machine van @discordjs/voice herstelt zelf.
            Logger.error(`Voiceverbinding: ${error.message}`);
        });

        this.connection.on(VoiceConnectionStatus.Disconnected, async () => {
            try {
                // Mogelijk verplaatst naar een ander kanaal: even wachten op herverbinding.
                await Promise.race([
                    entersState(this.connection, VoiceConnectionStatus.Signalling, 5_000),
                    entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000),
                ]);
            } catch {
                this.destroy();
            }
        });
    }

    public async addSong(song: Song) {
        this.songs.push(song);

        if (this.player.state.status === AudioPlayerStatus.Idle && !this.isLoading) {
            await this.play();
        }
    }

    public getSongs(): readonly Song[] {
        return Object.freeze([...this.songs]);
    }

    public getVoiceChannel() {
        return this.textChannel.guild.members.me?.voice.channel;
    }

    public getTextChannel() {
        return this.textChannel;
    }

    public async play(): Promise<void> {
        if (this.destroyed) return;
        const song = this.songs[0];
        if (!song) return this.destroy();

        const token = ++this.loadToken;
        this.isLoading = true;
        try {
            await entersState(this.connection, VoiceConnectionStatus.Ready, 20_000);
            const resource = await this.createResource(song);
            if (this.destroyed || token !== this.loadToken) return;

            this.player.play(resource);
            // Een kapotte stream bereikt nooit Playing en wordt zo een afspeelfout.
            await entersState(this.player, AudioPlayerStatus.Playing, 5_000);

            void this.textChannel
                .send({
                    embeds: [
                        Client.embed()
                            .setTitle(`Nu speelt: **${song.title}**`)
                            .setDescription(song.url)
                            .setThumbnail(song.thumbnail ?? null)
                            .setFooter({ text: `Duur: ${song.duration ?? "onbekend"}` }),
                    ],
                })
                .catch((error) => Logger.error(`Kon "Nu speelt"-bericht niet versturen: ${error}`));
        } catch (error) {
            if (this.destroyed || token !== this.loadToken) return;

            Logger.error(`Afspelen van "${song.title}" mislukt: ${error instanceof Error ? error.message : error}`);
            await this.textChannel.send(`Afspelen van **${song.title}** mislukt. Overslaan...`).catch(() => undefined);
            this.songs.shift();
            void this.play();
        } finally {
            if (token === this.loadToken) this.isLoading = false;
        }
    }

    private async createResource(song: Song) {
        this.stopDownload();

        const child = spawn(
            process.env.YTDLP_PATH ?? "yt-dlp",
            [
                "--no-playlist",
                "--no-warnings",
                "--quiet",
                "-f",
                "bestaudio[acodec=opus]/bestaudio/best",
                "-o",
                "-",
                song.url,
            ],
            { stdio: ["ignore", "pipe", "pipe"] },
        );
        this.downloadProcess = child;

        let stderr = "";
        child.stderr.setEncoding("utf8");
        child.stderr.on("data", (chunk: string) => (stderr += chunk));
        child.once("close", (code) => {
            if (code !== null && code !== 0) Logger.error(`yt-dlp stopte met code ${code}: ${stderr.trim()}`);
        });

        try {
            const probe = await Promise.race([
                demuxProbe(child.stdout),
                new Promise<never>((_, reject) => child.once("error", reject)),
            ]);
            return createAudioResource(probe.stream, { inputType: probe.type });
        } catch (error) {
            // Alleen het eigen kind opruimen: er kan intussen al een nieuwe download lopen.
            child.kill("SIGKILL");
            if (this.downloadProcess === child) this.downloadProcess = null;
            throw error;
        }
    }

    private stopDownload() {
        if (this.downloadProcess && this.downloadProcess.exitCode === null) {
            this.downloadProcess.kill("SIGKILL");
        }
        this.downloadProcess = null;
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
        if (this.destroyed) return;
        this.destroyed = true;
        this.loadToken++;
        this.songs = [];
        this.stopDownload();
        this.player.stop();
        if (this.connection.state.status !== VoiceConnectionStatus.Destroyed) {
            this.connection.destroy();
        }

        // Alleen de eigen registratie opruimen: voor deze guild kan al een nieuwe speler bestaan.
        if (MusicRegistry.getInstance(this.textChannel.guild) === this) {
            MusicRegistry.destroyInstance(this.textChannel.guild);
        }
    }

    public skip() {
        if (this.player.state.status !== AudioPlayerStatus.Idle) {
            this.player.stop(); // De Idle-handler start daarna de volgende song.
        } else if (this.isLoading) {
            this.songs.shift();
            void this.play();
        }
    }
}

function extractVideoId(input: string): string | null {
    const withScheme = /^[a-z][a-z0-9+.-]*:\/\//i.test(input) ? input : `https://${input}`;

    try {
        const url = new URL(withScheme);
        if (url.hostname === "youtu.be") {
            return url.pathname.slice(1).split("/")[0] || null;
        }
        if (url.hostname === "youtube.com" || url.hostname.endsWith(".youtube.com")) {
            if (url.pathname === "/watch") return url.searchParams.get("v");
            return url.pathname.match(/^\/(?:shorts|live|embed)\/([\w-]+)/)?.[1] ?? null;
        }
    } catch {
        // Geen URL: behandelen als zoekopdracht.
    }
    return null;
}

function formatDuration(totalSeconds: number | undefined): string | undefined {
    if (!totalSeconds || totalSeconds <= 0) return undefined;

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const padded = (value: number) => value.toString().padStart(2, "0");

    return hours > 0 ? `${hours}:${padded(minutes)}:${padded(seconds)}` : `${minutes}:${padded(seconds)}`;
}
