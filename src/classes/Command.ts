import { CommandExecutor } from "@/types";
import { SlashCommandOptionsOnlyBuilder } from "discord.js";

interface CommandOptions {
    data: SlashCommandOptionsOnlyBuilder;
    execute: CommandExecutor;
}

export default class Command {
    public data: SlashCommandOptionsOnlyBuilder;
    public execute: CommandExecutor;

    constructor({ data, execute }: CommandOptions) {
        this.data = data;
        this.execute = execute;
    }
}
