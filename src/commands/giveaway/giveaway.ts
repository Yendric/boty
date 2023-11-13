import { ChannelType, CommandInteraction, EmbedBuilder, SlashCommandBuilder, TextChannel } from "discord.js";
import ms from "ms";
import { client } from "../..";
import CommandProps from "../../types/CommandProps";

export default {
  data: new SlashCommandBuilder()
    .setName("giveaway")
    .setDescription("Start een giveaway.")
    .addIntegerOption((option) =>
      option.setName("winnaars").setDescription("Hoeveel winnaars moeten er zijn?").setRequired(true)
    )
    .addStringOption((option) =>
      option.setName("tijd").setDescription("Hoelang moet de giveaway duren? (bv 1d5h3m)").setRequired(true)
    )
    .addChannelOption((option) =>
      option.setName("channel").setDescription("In welk channel moet de giveaway plaatsvinden?").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("Geef een beschrijving van het item dat wordt weggegeven.")
        .setRequired(true)
    ),
  defaultPermission: false,
  async execute(interaction: CommandInteraction, { options }: CommandProps) {
    const aantalWinnaars = options.getInteger("winnaars");
    const tijd = options.getString("tijd");
    const channel = options.getChannel("channel") as TextChannel;
    const item = options.getString("item");

    if (!aantalWinnaars || !tijd || !channel || !item || channel.type !== ChannelType.GuildText) throw new Error();

    const giveawayEmbed = new EmbedBuilder()
      .setTitle(`🎉 **GIVEAWAY: ${item}** `)
      .setDescription(
        `**Aantal winnaars**: ${aantalWinnaars}\n**Eindigt op**: ${new Date(new Date().getTime() + ms(tijd))}`
      )
      .setFooter({ text: "Eindigt om" })
      .setTimestamp()
      .setColor("#00FF00");

    await interaction.reply("Giveaway aangemaakt!");
    const embedSend = await channel.send({ embeds: [giveawayEmbed] });
    embedSend.react("🎉");

    setTimeout(async function () {
      if (!embedSend) return;
      const reaction = embedSend.reactions.cache.first();
      if (!reaction) return;
      const peopleReacted = reaction.users.cache.filter((user) => user.id !== client.user?.id);

      if (peopleReacted.size < aantalWinnaars) {
        embedSend.edit({
          embeds: [
            new EmbedBuilder()
              .setTitle(`🎉 **GIVEAWAY: ${item}** `)
              .setDescription("**Winnaars**: niemand heeft gewonnen")
              .setFooter({ text: "Beëindigd om" })
              .setTimestamp()
              .setColor("#00FF00"),
          ],
        });
        return channel.send("Er waren te weinig deelnemers dus niemand heeft gewonnen");
      }

      const winners = [];
      for (let i = 0; i < aantalWinnaars; i++) {
        const winner = peopleReacted.random();
        if (!winner) return;
        winners.push(winner);
        peopleReacted.delete(winner.id);
      }

      embedSend.edit({
        embeds: [
          new EmbedBuilder()
            .setTitle(`🎉 **GIVEAWAY: ${item}** `)
            .setDescription(`**Winnaars**: ${winners.join()}`)
            .setFooter({ text: "Beëindigd om" })
            .setTimestamp()
            .setColor("#00FF00"),
        ],
      });
      winners.forEach((winner) => {
        channel.send(`Gefeliciteerd ${winner}! Je hebt **${item}** gewonnen.`);
      });
    }, ms(tijd));
  },
};
