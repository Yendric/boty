/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SlashCommandBuilder } from "@discordjs/builders";
import { getSettings } from "../../utils/database";
import { client } from "../..";
import { CommandInteraction, CommandInteractionOption } from "discord.js";
import CommandProps from "../../types/CommandProps";
import { loadCommandsForGuild } from "../../services/commands";

export default {
  data: new SlashCommandBuilder()
    .setName("setconfig")
    .setDescription("Stel een configvariabele in.")
    // Autorole
    .addSubcommand((subcommand) =>
      subcommand
        .setName("autoRoleEnabled")
        .setDescription("Zet autorole aan of uit.")
        .addBooleanOption((option) =>
          option.setName("autoRoleEnabled").setDescription("Zet autorole aan of uit.").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("autoRole")
        .setDescription("Welke role moet gegeven worden?")
        .addRoleOption((option) =>
          option.setName("autoRole").setDescription("Welke role moet gegeven worden?").setRequired(true)
        )
    )
    // Welcome
    .addSubcommand((subcommand) =>
      subcommand
        .setName("welcomeMessageEnabled")
        .setDescription("Zet de welcome message aan of uit.")
        .addBooleanOption((option) =>
          option.setName("welcomeMessageEnabled").setDescription("Zet de welcome message aan of uit.").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("welcomeMessage")
        .setDescription("Wat moet er gestuurd worden?")
        .addStringOption((option) =>
          option
            .setName("welcomeMessage")
            .setDescription("Wat moet er gestuurd worden? Placeholders: {{server}}, {{naam}}")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("welcomeMessageChannel")
        .setDescription("Waar moet het bericht gestuurd worden worden?")
        .addChannelOption((option) =>
          option
            .setName("welcomeMessageChannel")
            .setDescription("Waar moet het bericht gestuurd worden worden?")
            .setRequired(true)
        )
    )
    // Goodbye
    .addSubcommand((subcommand) =>
      subcommand
        .setName("goodbyeMessageChannel")
        .setDescription("Zet de welcome message aan of uit.")
        .addBooleanOption((option) =>
          option.setName("goodbyeMessageChannel").setDescription("Zet de goodbye message aan of uit.").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("goodbyeMessage")
        .setDescription("Wat moet er gestuurd worden?")
        .addStringOption((option) =>
          option
            .setName("goodbyeMessage")
            .setDescription("Wat moet er gestuurd worden? Placeholders: {{server}}, {{naam}}")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("goodbyeMessageChannel")
        .setDescription("Waar moet het bericht gestuurd worden worden?")
        .addChannelOption((option) =>
          option
            .setName("goodbyeMessageChannel")
            .setDescription("Waar moet het bericht gestuurd worden worden?")
            .setRequired(true)
        )
    )
    // Memes
    .addSubcommand((subcommand) =>
      subcommand
        .setName("memesEnabled")
        .setDescription("Zet de memes module aan of uit.")
        .addBooleanOption((option) =>
          option.setName("memesEnabled").setDescription("Zet de memes module aan of uit.").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("memesChannel")
        .setDescription("Wat is het memes kanaal?")
        .addChannelOption((option) =>
          option.setName("memesChannel").setDescription("Wat is het memes kanaal?").setRequired(true)
        )
    )
    // Admin role
    .addSubcommand((subcommand) =>
      subcommand
        .setName("adminRole")
        .setDescription("Welke role moet administratieve toegang hebben tot de bot?")
        .addRoleOption((option) =>
          option
            .setName("adminRole")
            .setDescription("Welke role moet administratieve toegang hebben tot de bot?")
            .setRequired(true)
        )
    ),
  defaultPermission: false,
  async execute(interaction: CommandInteraction, { guild, options }: CommandProps) {
    const settings = await getSettings(guild);
    const option = options.data[0];
    const value = getDataValue(option);
    if (!value) return interaction.reply("Je moet een tekstkanaal opgeven.");

    // @ts-ignore
    settings[option.name] = getDataValue(option);
    await settings.save();
    // Als er een admin role geüpdated zou zijn, moet dit ook geüpdated worden bij discord.
    if (option.name === "adminRole") {
      loadCommandsForGuild(guild);
    }

    interaction.reply("Waarde succesvol ingesteld. Bekijk de nieuwe config met /config.");
  },
};

function getDataValue(option: CommandInteractionOption) {
  if (!option.options?.length) return;
  const options = option.options[0] ?? null;
  if (!options.value) return;

  if (options.type === "CHANNEL") {
    if (client.channels.cache.get(options.value.toString())?.type === "GUILD_TEXT") {
      return options.value;
    } else {
      return;
    }
  }
  return options.value;
}
