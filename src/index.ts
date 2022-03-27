import { Client, Intents } from "discord.js";
import { config } from "dotenv";
import { loadCommands } from "./services/commands";
import { loadEvents } from "./services/events";
import { loadDebugLogger } from "./services/debug";
import { loadDatabase } from "./services/database";
import { log } from "./utils/logging";

config();

export const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
    Intents.FLAGS.GUILD_INTEGRATIONS,
    Intents.FLAGS.GUILD_WEBHOOKS,
    Intents.FLAGS.GUILD_INVITES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
  ],
});

client.once("ready", () => {
  loadDebugLogger();
  loadDatabase();
  loadCommands();
  loadEvents();
  log(`${client.user?.username} is online op ${client.guilds.cache.size} server(s)!`);
  client.user?.setActivity("jou", { type: "WATCHING" });
});

client.login(process.env.TOKEN);
