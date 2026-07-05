import EventHandler from "@/classes/EventHandler";
import Logger from "@/services/Logger";
import { Events, MessageFlags } from "discord.js";

export default new EventHandler({
    event: Events.InteractionCreate,
    async execute(client, [interaction]) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(client, interaction);
        } catch (error) {
            Logger.error(
                `Fout bij /${interaction.commandName}: ${error instanceof Error ? (error.stack ?? error.message) : error}`,
            );

            const errorReply = {
                content: "Er is iets fout gegaan bij het uitvoeren van dit commando!",
                flags: MessageFlags.Ephemeral,
            } as const;

            try {
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp(errorReply);
                } else {
                    await interaction.reply(errorReply);
                }
            } catch {
                // Interactie is verlopen: er valt niets meer te antwoorden.
            }
        }
    },
});
