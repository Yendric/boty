import { Guild, Snowflake } from "discord.js";
import Server from "../models/Server";
import Users from "../models/User";

export async function ensureSettings(guild: Guild) {
  let server = await Server.findOne({ where: { guildId: guild.id } });
  if (!server) {
    server = await Server.create({
      guildId: guild.id,
    });
  }
  return server;
}

export function deleteSettings(guild: Guild) {
  Server.destroy({ where: { guildId: guild.id } });
}

export function getSettings(guild: Guild) {
  return ensureSettings(guild);
}

export async function ensureUser(snowflake: Snowflake) {
  let user = await Users.findOne({ where: { snowflake } });
  if (!user) {
    user = await Users.create({
      snowflake,
    });
  }
  return user;
}

export function getUser(snowflake: Snowflake) {
  return ensureUser(snowflake);
}
