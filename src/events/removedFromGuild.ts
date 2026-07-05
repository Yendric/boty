import EventHandler from "@/classes/EventHandler";
import Logger from "@/services/Logger";
import { Events } from "discord.js";

export default new EventHandler({
    event: Events.GuildDelete,
    execute(_, [guild]) {
        Logger.log("Guild verlaten: " + guild.name);
    },
});
