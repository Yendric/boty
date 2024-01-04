import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { client } from "../..";
import GuildCommand from "@/classes/GuildCommand";

export default new GuildCommand({
    data: new SlashCommandBuilder().setName("ping").setDescription("Toont de huidige ping."),
    async execute(_, interaction) {
        await interaction.reply(`API ping: ${Math.round(client.ws.ping)}ms`);
    },
});
