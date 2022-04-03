import { Guild } from "discord.js";
import { log } from "../utils/logging";

export default {
  name: "guildDelete",
  async execute(guild: Guild) {
    log("Guild verlaten: " + guild.name);
  },
};
