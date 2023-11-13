import { Guild } from "discord.js";
import { getSettings } from "../utils/database";

export async function permissionsForGuild(guild: Guild) {
  const settings = await getSettings(guild);
  const commands = await guild.commands.fetch();

  const fullPermissions: any[] = [];
  let rolePermissions: any;
  if (settings.adminRole && guild.roles.cache.get(settings.adminRole)) {
    rolePermissions = {
      id: settings.adminRole,
      type: "ROLE",
      permission: true,
    };
  }

  commands.each(async (command) => {
    const permissions: any = {
      id: command.id,
      permissions: [
        {
          id: guild.ownerId,
          type: "USER",
          permission: true,
        },
      ],
    };
    if (rolePermissions) permissions.permissions = [...permissions.permissions, rolePermissions];
    fullPermissions.push(permissions);
  });
  /* @ts-ignore */
  await guild?.commands.permissions.set({
    token: process.env.TOKEN ?? "",
    permissions: fullPermissions,
  });
}
