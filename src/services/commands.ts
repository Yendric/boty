/* eslint-disable @typescript-eslint/no-var-requires */
import { client } from "..";
import { Collection, Guild } from "discord.js";
import { getFiles } from "../utils/files";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { permissionsForGuild } from "./permissions";
import Command from "../types/Command";
import { log } from "../utils/logging";

export const commands = new Collection<string, Command>();

export function loadCommands() {
  getFiles("commands").forEach(async (file) => {
    const command = require("../" + file).default;
    commands.set(command.data.name, command);
  });

  client.guilds.cache.each(loadCommandsForGuild);
}

export async function loadCommandsForGuild(guild: Guild) {
  if (!process.env.TOKEN) return;

  const rest = new REST({ version: "9" }).setToken(process.env.TOKEN);

  if (!process.env.APPLICATION_ID) return;
  log("Slash commands initialiseren voor: " + guild.name);

  await rest.put(Routes.applicationGuildCommands(process.env.APPLICATION_ID, guild.id), {
    body: commands.map((command) => {
      const data = command.data.toJSON();
      data.default_permission = command.defaultPermission ?? true;
      return data;
    }),
  });
  await permissionsForGuild(guild);
  log("Slash commands succesvol geïnitialiseerd voor: " + guild.name);
}
