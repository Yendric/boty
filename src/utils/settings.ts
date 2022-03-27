import { Guild } from "discord.js";
import { client } from "..";
import Server from "../models/Server";

export function ensureSettings(guild: Guild) {
  return Server.create({ id: guild.id });
}

export async function getSettings(guild: Guild) {
  await ensureSettings(guild);
  return Server.findOne({ where: { id: guild.id } });
}

export async function getChannel(guild: Guild, key: keyof Server) {
  const server = await Server.findOne({ where: { id: guild.id } });
  if (!server) return;

  return client.guilds.cache.get(guild.id)?.channels.cache.get(server[key]);
}

export async function getMessage(guild: Guild, key: keyof Server) {
  const server = await Server.findOne({ where: { id: guild.id } });
  if (!server) return;

  return server[key];
}
