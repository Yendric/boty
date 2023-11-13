import { client } from "..";
import { getFiles } from "../utils/files";

function loadEvents() {
  getFiles("events").forEach(async (file) => {
    const event = require("../" + file).default;
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client.guilds.cache.get(args[0].guild.id)));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client.guilds.cache.get(args[0].guild.id)));
    }
  });
}

export { loadEvents };
