import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { pause } from "../../services/music";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder().setName("pause").setDescription("Pauzeer de muziek."),
  async execute(interaction: CommandInteraction, { guild, member }: CommandProps) {
    if (!member.voice.channel) return interaction.reply("Je moet in een voice channel zijn om de muziek te pauzeren!");

    pause(guild);
    interaction.reply("Muziek gepauzeerd.");
  },
};
