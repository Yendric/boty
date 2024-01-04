import EventHandler from "@/classes/EventHandler";
import Logger from "@/services/Logger";

export default new EventHandler({
    event: "guildCreate",
    async execute(_, [guild]) {
        Logger.log("Guild gejoind: " + guild.name);
    },
});
