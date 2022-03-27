import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { skip } from "../../services/music";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder().setName("skip").setDescription("Skip de wachtrij."),
  async execute(interaction: CommandInteraction, { guild, member }: CommandProps) {
    if (!member.voice?.channel) return interaction.reply("Je moet in een voice channel zijn om de muziek te skippen!");

    skip(guild);
    interaction.reply("Liedje geskipt.");
  },
};
