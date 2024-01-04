import GuildCommand from "@/classes/GuildCommand";
import { SlashCommandBuilder } from "discord.js";

export default new GuildCommand({
    data: new SlashCommandBuilder().setName("ping").setDescription("Toont de huidige ping."),
    async execute(client, interaction) {
        await interaction.reply(`API ping: ${Math.round(client.ws.ping)}ms`);
    },
});
