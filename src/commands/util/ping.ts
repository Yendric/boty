import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { client } from "../..";

export default {
  data: new SlashCommandBuilder().setName("ping").setDescription("Toont de huidige ping."),
  async execute(interaction: CommandInteraction) {
    interaction.reply(`API ping: ${Math.round(client.ws.ping)}ms`);
  },
};
