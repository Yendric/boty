import EventHandler from "@/classes/EventHandler";

export default new EventHandler({
    event: "interactionCreate",
    async execute(client, [interaction]) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(client, interaction);
        } catch (error) {
            if (interaction.channel?.isSendable()) {
                await interaction.channel.send({
                    content: "Er is iets foutsgegaan bij het uitvoeren van dit commando!",
                });
            }
            throw error;
        }
    },
});
