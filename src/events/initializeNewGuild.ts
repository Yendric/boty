import EventHandler from "@/classes/EventHandler";
import Logger from "@/services/Logger";
import { Events } from "discord.js";

export default new EventHandler({
    event: Events.GuildCreate,
    execute(_, [guild]) {
        Logger.log("Guild gejoind: " + guild.name);
    },
});
