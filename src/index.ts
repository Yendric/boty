import { config } from "dotenv";
import Client from "./classes/Client";
import { GatewayIntentBits } from "discord.js";
import Logger from "./services/Logger";
import { getEnvVariable } from "./utils/environment";

config();

const BOT_TOKEN = getEnvVariable("BOT_TOKEN");

export const client = new Client(BOT_TOKEN, {
    intents: [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
});

if (process.env.debug) {
    client.on("error", (err) => Logger.error(`[DEBUG] djserror: ${err.message}`));
    client.on("warn", (err) => Logger.error(`[DEBUG] djswarn: ${err}`));
}

process.on("uncaughtException", function (err) {
    Logger.error(`Uncaught exception (recovered): ${err.stack}`);
});
