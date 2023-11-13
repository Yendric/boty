import { ActivityType, Client, GatewayIntentBits } from "discord.js";
import { config } from "dotenv";
import { loadCommands } from "./services/commands";
import { loadEvents } from "./services/events";
import { loadDebugLogger } from "./services/debug";
import { loadDatabase } from "./services/database";
import { log } from "./utils/logging";

config();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ],
});

client.once("ready", () => {
  loadDebugLogger();
  loadDatabase();
  loadCommands();
  loadEvents();
  log(`${client.user?.username} is online op ${client.guilds.cache.size} server(s)!`);
  client.user?.setActivity("jou", { type: ActivityType.Watching });
});

client.login(process.env.TOKEN);
