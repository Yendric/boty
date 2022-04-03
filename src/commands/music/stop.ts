import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { stop } from "../../services/music";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder().setName("stop").setDescription("Stop de muziek."),
  async execute(interaction: CommandInteraction, { guild, member }: CommandProps) {
    if (!member.voice?.channel) return interaction.reply("Je moet in een voice channel zijn om de muziek te stoppen!");

    stop(guild);
    interaction.reply("De muziek is gestopt.");
  },
};
