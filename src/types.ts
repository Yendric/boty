import Client from "@/classes/Client";
import { ChatInputCommandInteraction, ClientEvents, Guild, GuildChannel, GuildMember } from "discord.js";

export type CommandExecutor = (client: Client, interaction: ChatInputCommandInteraction) => Promise<unknown> | unknown;

export type GuildCommandInteraction = ChatInputCommandInteraction & {
    member: GuildMember;
    guild: Guild;
    channel: GuildChannel;
};

export type GuildCommandExecutor = (client: Client, interaction: GuildCommandInteraction) => Promise<unknown> | unknown;

export type EventExecutor<T extends keyof ClientEvents> = (
    client: Client,
    eventData: ClientEvents[T]
) => Promise<void> | void;

export enum MessageType {
    Info,
    Success,
    Error,
}

export type NumIcons = { [key: number]: string[] };

export type Contributor = {
    userId: string;
    guildId: string;
    contributedNumbers: number;
};
