import Logger from "@/services/Logger";
import EventHandler from "@/classes/EventHandler";

export default new EventHandler({
    event: "guildCreate",
    async execute(_, [guild]) {
        Logger.log("Guild gejoind: " + guild.name);
    },
});
