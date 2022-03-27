import { SlashCommandBuilder } from "@discordjs/builders";
import { CommandInteraction } from "discord.js";
import { getSettings } from "../../utils/database";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder().setName("config").setDescription("Toont de huidige server configuratie."),
  defaultPermission: false,
  async execute(interaction: CommandInteraction, { guild }: CommandProps) {
    const settings = await getSettings(guild);
    interaction.reply(`De huidige server configuratie: \`\`\`js\n${JSON.stringify(settings, undefined, 2)} \`\`\``);
  },
};
