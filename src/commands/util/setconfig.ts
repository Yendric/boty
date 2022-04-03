/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SlashCommandBuilder } from "@discordjs/builders";
import { getSettings } from "../../utils/database";
import { client } from "../..";
import { CommandInteraction, CommandInteractionOption } from "discord.js";
import CommandProps from "../../types/CommandProps";
import { loadCommandsForGuild } from "../../services/commands";
import { snakeToCamal } from "../../utils/string";

export default {
  data: new SlashCommandBuilder()
    .setName("setconfig")
    .setDescription("Stel een configvariabele in.")
    // Autorole
    .addSubcommand((subcommand) =>
      subcommand
        .setName("auto_role_enabled")
        .setDescription("Zet autorole aan of uit.")
        .addBooleanOption((option) =>
          option.setName("auto_role_enabled").setDescription("Zet autorole aan of uit.").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("auto_role")
        .setDescription("Welke role moet gegeven worden?")
        .addRoleOption((option) =>
          option.setName("auto_role").setDescription("Welke role moet gegeven worden?").setRequired(true)
        )
    )
    // Welcome
    .addSubcommand((subcommand) =>
      subcommand
        .setName("welcome_message_enabled")
        .setDescription("Zet de welcome message aan of uit.")
        .addBooleanOption((option) =>
          option
            .setName("welcome_message_enabled")
            .setDescription("Zet de welcome message aan of uit.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("welcome_message")
        .setDescription("Wat moet er gestuurd worden?")
        .addStringOption((option) =>
          option
            .setName("welcome_message")
            .setDescription("Wat moet er gestuurd worden? Placeholders: {{server}}, {{naam}}")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("welcome_message_channel")
        .setDescription("Waar moet het bericht gestuurd worden worden?")
        .addChannelOption((option) =>
          option
            .setName("welcome_message_channel")
            .setDescription("Waar moet het bericht gestuurd worden worden?")
            .setRequired(true)
        )
    )
    // Goodbye
    .addSubcommand((subcommand) =>
      subcommand
        .setName("goodbye_message_enabled")
        .setDescription("Zet de welcome message aan of uit.")
        .addBooleanOption((option) =>
          option
            .setName("goodbye_message_enabled")
            .setDescription("Zet de goodbye message aan of uit.")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("goodbye_message")
        .setDescription("Wat moet er gestuurd worden?")
        .addStringOption((option) =>
          option
            .setName("goodbye_message")
            .setDescription("Wat moet er gestuurd worden? Placeholders: {{server}}, {{naam}}")
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("goodbye_message_channel")
        .setDescription("Waar moet het bericht gestuurd worden worden?")
        .addChannelOption((option) =>
          option
            .setName("goodbye_message_channel")
            .setDescription("Waar moet het bericht gestuurd worden worden?")
            .setRequired(true)
        )
    )
    // Memes
    .addSubcommand((subcommand) =>
      subcommand
        .setName("memes_enabled")
        .setDescription("Zet de memes module aan of uit.")
        .addBooleanOption((option) =>
          option.setName("memes_enabled").setDescription("Zet de memes module aan of uit.").setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("memes_channel")
        .setDescription("Wat is het memes kanaal?")
        .addChannelOption((option) =>
          option.setName("memes_channel").setDescription("Wat is het memes kanaal?").setRequired(true)
        )
    )
    // Admin role
    .addSubcommand((subcommand) =>
      subcommand
        .setName("admin_role")
        .setDescription("Welke role moet administratieve toegang hebben tot de bot?")
        .addRoleOption((option) =>
          option
            .setName("admin_role")
            .setDescription("Welke role moet administratieve toegang hebben tot de bot?")
            .setRequired(true)
        )
    ),
  defaultPermission: false,
  async execute(interaction: CommandInteraction, { guild, options }: CommandProps) {
    const settings = await getSettings(guild);
    const option = options.data[0];
    const optionName = snakeToCamal(option.name);
    const value = getDataValue(option);
    if (!value) return interaction.reply("Je moet een tekstkanaal opgeven.");

    // @ts-ignore
    settings[optionName] = getDataValue(option);
    await settings.save();
    // Als er een admin role geüpdated zou zijn, moet dit ook geüpdated worden bij discord.
    if (optionName === "adminRole") {
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
