import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { resume } from "../../services/music";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder().setName("resume").setDescription("Hervat de muziek."),
  async execute(interaction: CommandInteraction, { guild, member }: CommandProps) {
    if (!member?.voice?.channel)
      return interaction.reply("Je moet in een voice channel zijn om de muziek te hervatten!");

    resume(guild);
    interaction.reply("Muziek hervat.");
  },
};
