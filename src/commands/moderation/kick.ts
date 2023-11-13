import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder,
  GuildMember,
  PermissionFlagsBits,
  SlashCommandBuilder,
} from "discord.js";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick een gebruiker.")
    .addUserOption((option) =>
      option.setName("gebruiker").setDescription("Wie moet er gekicked worden?").setRequired(true)
    )
    .addStringOption((option) => option.setName("reden").setDescription("Wat is de reden?").setRequired(true)),
  defaultPermission: false,
  async execute(interaction: CommandInteraction, { guild, channel, options, member }: CommandProps) {
    if (!guild.members.me?.permissionsIn(channel).has(PermissionFlagsBits.KickMembers))
      return interaction.reply("Ik heb hier geen toestemming voor.");

    const gebruiker = options.getMember("gebruiker") as GuildMember;
    if (!gebruiker) return interaction.reply("Geen gebruiker opgegeven.");
    const reden = options.getString("reden");
    if (!reden) return interaction.reply("Geen reden opgegeven.");

    const kickEmbed = new EmbedBuilder()
      .setTitle(`${guild.name} | Moderatie`)
      .setDescription(`Wil je ${gebruiker} kicken?`)
      .setColor("#00ff00")
      .setFooter({ text: `Opgevraagd door ${member.displayName}` });

    const kickedEmbed = new EmbedBuilder()
      .setTitle(`${guild.name} | Moderatie`)
      .setDescription(
        `**Gekicked: ${gebruiker}**
			**Door:** ${member}
			**Reden:** ${reden}`
      )
      .setColor("#ff0000")
      .setTimestamp()
      .setFooter({ text: `Opgevraagd door ${member.displayName}` });

    const buttons = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(new ButtonBuilder().setCustomId("akkoord").setLabel("✅").setStyle(ButtonStyle.Success))
      .addComponents(new ButtonBuilder().setCustomId("weiger").setLabel("❌").setStyle(ButtonStyle.Danger));

    interaction.reply({ embeds: [kickEmbed], components: [buttons] });

    const collector = channel.createMessageComponentCollector({
      filter: (i) => i.user.id === interaction.user.id,
      time: 10000,
    });

    collector.on("collect", async (i) => {
      if (i.customId === "akkoord") {
        await i.update({
          content: "Straf wordt uigevoerd!",
          components: [],
          embeds: [],
        });
        try {
          await gebruiker.kick(reden);
          interaction.followUp({ embeds: [kickedEmbed] });
        } catch {
          channel.send("Ik heb geen toestemming hiervoor.");
        }
      } else if (i.customId === "weiger") {
        await i.update({
          content: "Straf geannuleerd!",
          components: [],
          embeds: [],
        });
      }
    });

    collector.on("end", async (collected) => {
      collected.size == 0 &&
        interaction.editReply({
          content: "Straf geannuleerd!",
          components: [],
          embeds: [],
        });
    });
  },
};
