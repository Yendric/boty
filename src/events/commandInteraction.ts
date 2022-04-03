import { CommandInteraction } from "discord.js";
import { CommandExecutionError } from "../errors/CommandExecutionError";
import { commands } from "../services/commands";
import CommandProps from "../types/CommandProps";

export default {
  name: "interactionCreate",
  async execute(interaction: CommandInteraction) {
    if (!interaction.isCommand()) return;

    const command = commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction, interaction as CommandProps);
    } catch (error) {
      let content = "Er is iets foutsgegaan bij het uitvoeren van dit commando!";
      if (error instanceof CommandExecutionError) content = error.message;
      await interaction.reply({
        content,
        ephemeral: true,
      });
    }
  },
};
