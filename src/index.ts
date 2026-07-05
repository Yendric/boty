import Client from "@/classes/Client";
import { prisma } from "@/db/db";
import Logger from "@/services/Logger";
import { MusicRegistry } from "@/services/Music";
import { getEnvVariable } from "@/utils/environment";
import { Events, GatewayIntentBits } from "discord.js";
import { loadEnvFile } from "node:process";

try {
    loadEnvFile();
} catch {
    // Geen .env-bestand
}

export const client = new Client({
    intents: [
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
    ],
});

if (process.env.DEBUG === "true") {
    client.on(Events.Error, (error) => Logger.error(`[DEBUG] djserror: ${error.message}`));
    client.on(Events.Warn, (warning) => Logger.error(`[DEBUG] djswarn: ${warning}`));
}

process.on("unhandledRejection", (reason) => {
    Logger.error(`Unhandled rejection: ${reason instanceof Error ? (reason.stack ?? reason.message) : reason}`);
});

process.on("uncaughtException", (error) => {
    Logger.error(`Uncaught exception: ${error.stack ?? error.message}`);
    process.exit(1);
});

async function shutdown() {
    Logger.log("Afsluiten...");
    MusicRegistry.destroyAll();
    await client.destroy();
    await prisma.$disconnect();
    process.exit(0);
}

process.once("SIGINT", () => void shutdown());
process.once("SIGTERM", () => void shutdown());

client.start(getEnvVariable("BOT_TOKEN")).catch((error) => {
    Logger.error(`Opstarten mislukt: ${error instanceof Error ? (error.stack ?? error.message) : error}`);
    process.exit(1);
});
