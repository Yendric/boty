import { MessageEmbed, MessageActionRow, MessageButton, CommandInteraction, Snowflake } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { client } from "../..";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban een gebruiker.")
    .addStringOption((option) =>
      option.setName("snowflake").setDescription("Wie moet er geunbanned worden? (snowflake)").setRequired(true)
    ),
  defaultPermission: false,
  async execute(interaction: CommandInteraction, { guild, channel, options, member }: CommandProps) {
    if (!guild.me?.permissionsIn(channel).has("BAN_MEMBERS"))
      return interaction.reply("Ik heb hier geen toestemming voor.");

    const gebruiker = await client.users.fetch(options.getString("snowflake") as Snowflake);
    if (!gebruiker) return interaction.reply("Gelieve een snowflake op te geven");

    const banList = guild.bans.cache;
    const bannedUser = banList.find((guildBan) => guildBan.user.id === gebruiker.id);
    if (!bannedUser) return interaction.reply(`${gebruiker} is niet verbannen.`);

    const banEmbed = new MessageEmbed()
      .setTitle(`${guild.name} | Moderatie`)
      .setDescription(`Wil je ${gebruiker} unbannen?`)
      .setColor("#00ff00")
      .setFooter({ text: `Opgevraagd door ${member.displayName}` });

    const bannedEmbed = new MessageEmbed()
      .setTitle(`${guild.name} | Moderatie`)
      .setDescription(
        `**Unbanned: ${gebruiker}**
			**Door:** ${interaction.member}`
      )
      .setColor("#00ff00")
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
          content: "Unban wordt uigevoerd!",
          components: [],
          embeds: [],
        });
        try {
          await guild.members.unban(gebruiker);
          interaction.followUp({ embeds: [bannedEmbed] });
        } catch {
          channel.send("Ik heb geen toestemming hiervoor.");
        }
      } else if (i.customId === "weiger") {
        await i.update({
          content: "Unban geannuleerd!",
          components: [],
          embeds: [],
        });
      }
    });

    collector.on("end", async (collected) => {
      collected.size == 0 &&
        interaction.editReply({
          content: "Unban geannuleerd!",
          components: [],
          embeds: [],
        });
    });
  },
};
