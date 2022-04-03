import { MessageEmbed, MessageActionRow, MessageButton, CommandInteraction, GuildMember } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Verban een gebruiker.")
    .addUserOption((option) =>
      option.setName("gebruiker").setDescription("Wie moet er verbannen worden?").setRequired(true)
    )
    .addStringOption((option) => option.setName("reden").setDescription("Wat is de reden?").setRequired(true)),
  defaultPermission: false,
  async execute(interaction: CommandInteraction, { guild, channel, options, member }: CommandProps) {
    if (!guild.me?.permissionsIn(channel).has("BAN_MEMBERS"))
      return interaction.reply("Ik heb hier geen toestemming voor.");

    const gebruiker = options.getMember("gebruiker") as GuildMember;
    if (!gebruiker) return interaction.reply("Geen gebruiker opgegeven.");
    const reden = options.getString("reden");
    if (!reden) return interaction.reply("Geen reden opgegeven.");

    const banEmbed = new MessageEmbed()
      .setTitle(`${guild.name} | Moderatie`)
      .setDescription(`Wil je ${gebruiker} verbannen?`)
      .setColor("#00ff00")
      .setFooter({ text: `Opgevraagd door ${member.displayName}` });

    const bannedEmbed = new MessageEmbed()
      .setTitle(`${guild.name} | Moderatie`)
      .setDescription(
        `**Verbannen: ${gebruiker}**
			**Door:** ${interaction.member}
			**Reden:** ${reden}`
      )
      .setColor("#ff0000")
      .setTimestamp()
      .setFooter({ text: `Opgevraagd door ${member.displayName}` });

    const buttons = new MessageActionRow()
      .addComponents(new MessageButton().setCustomId("akkoord").setLabel("✅").setStyle("SUCCESS"))
      .addComponents(new MessageButton().setCustomId("weiger").setLabel("❌").setStyle("DANGER"));

    interaction.reply({ embeds: [banEmbed], components: [buttons] });

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
          await gebruiker.ban({ reason: reden });
          interaction.followUp({ embeds: [bannedEmbed] });
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
