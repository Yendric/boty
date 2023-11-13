import { CommandInteraction, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import CommandProps from "./CommandProps";

export default interface Command {
  data: SlashCommandSubcommandsOnlyBuilder;
  defaultPermission?: boolean;
  execute: (interaction: CommandInteraction, commandProps: CommandProps) => Promise<void>;
}
