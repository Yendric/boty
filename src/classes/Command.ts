import { CommandExecutor } from "@/types";
import { SlashCommandBuilder } from "discord.js";

interface CommandOptions {
    data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    execute: CommandExecutor;
}

export default class Command {
    public data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    public execute: CommandExecutor;

    constructor({ data, execute }: CommandOptions) {
        this.data = data;
        this.execute = execute;
    }
}
