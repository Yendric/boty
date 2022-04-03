import { Guild } from "discord.js";
import { loadCommandsForGuild } from "../services/commands";
import { ensureSettings } from "../utils/database";
import { log } from "../utils/logging";

export default {
  name: "guildCreate",
  async execute(guild: Guild) {
    log("Guild gejoined: " + guild.name);
    ensureSettings(guild);
    loadCommandsForGuild(guild);
  },
};
