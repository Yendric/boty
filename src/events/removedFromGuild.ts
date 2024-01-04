import EventHandler from "@/classes/EventHandler";
import Logger from "@/services/Logger";

export default new EventHandler({
    event: "guildDelete",
    async execute(_, [guild]) {
        Logger.log("Guild verlaten: " + guild.name);
    },
});
