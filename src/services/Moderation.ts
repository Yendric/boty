import Client from "@/classes/Client";
import { GuildCommandInteraction } from "@/types";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

enum ButtonId {
    Continue = "continue",
    Cancel = "cancel",
}

const banButtons = new ActionRowBuilder<ButtonBuilder>()
    .addComponents(new ButtonBuilder().setCustomId(ButtonId.Continue).setLabel("✅").setStyle(ButtonStyle.Success))
    .addComponents(new ButtonBuilder().setCustomId(ButtonId.Cancel).setLabel("❌").setStyle(ButtonStyle.Danger));

export default class ModerationService {
    public static async generateModerationInstructions(
        interaction: GuildCommandInteraction,
        instructions: string,
        callback: () => Promise<void>
    ) {
        const instructionEmbed = Client.embed().setDescription(instructions);
        const instructionMessage = await interaction.reply({
            embeds: [instructionEmbed],
            components: [banButtons],
            fetchReply: true,
        });

        const collector = instructionMessage.createMessageComponentCollector({
            filter: (buttonInteraction) => buttonInteraction.user.id === interaction.user.id,
            time: 10000,
        });

        collector.on("collect", async (buttonInteraction) => {
            if (buttonInteraction.customId === ButtonId.Continue) {
                await buttonInteraction.update({
                    content: "Straf wordt uitgevoerd!",
                    components: [],
                    embeds: [],
                });
                await callback();
            } else if (buttonInteraction.customId === ButtonId.Cancel) {
                await buttonInteraction.update({
                    content: "Straf geannuleerd!",
                    components: [],
                    embeds: [],
                });
            }
        });

        collector.on("end", async (collected) => {
            if (collected.size == 0) {
                await interaction.editReply({
                    content: "Straf geannuleerd!",
                    components: [],
                    embeds: [],
                });
            }
        });
    }
}
