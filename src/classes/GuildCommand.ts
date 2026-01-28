import Command from "@/classes/Command";
import { CommandExecutor, GuildCommandExecutor, GuildCommandInteraction } from "@/types";
import { GuildChannel, GuildMember, SlashCommandOptionsOnlyBuilder } from "discord.js";

export interface GuildCommandOptions {
    data: SlashCommandOptionsOnlyBuilder;
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
