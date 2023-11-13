import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder()
    .setName("say")
    .setDescription("Laat de bot iets zeggen.")
    .addStringOption((option) =>
      option.setName("bericht").setDescription("Wat wil je me laten zeggen?").setRequired(true)
    ),
  defaultPermission: false,
  async execute(interaction: CommandInteraction, { channel, options }: CommandProps) {
    const bericht = options.getString("bericht");
    if (!bericht) return;

    interaction.reply("Actie wordt uitgevoerd...");
    channel.send(bericht);
    interaction.deleteReply();
  },
};
