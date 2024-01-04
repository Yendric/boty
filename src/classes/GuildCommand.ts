import { GuildChannel, GuildMember, SlashCommandBuilder } from "discord.js";
import Command from "./Command";
import { CommandExecutor, GuildCommandExecutor, GuildCommandInteraction } from "@/types";

export interface GuildCommandOptions {
    data: SlashCommandBuilder | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">;
    execute: GuildCommandExecutor;
}

export default class GuildCommand extends Command {
    constructor({ data, execute }: GuildCommandOptions) {
        const executeWrapper: CommandExecutor = async (client, interaction) => {
            if (
                !interaction.guild ||
                !(interaction.member instanceof GuildMember) ||
                !(interaction.channel instanceof GuildChannel)
            )
                return interaction.reply("Dit commando kan alleen in een server gebruikt worden.");

            return execute(client, interaction as GuildCommandInteraction);
        };

        super({ data, execute: executeWrapper });
    }
}
