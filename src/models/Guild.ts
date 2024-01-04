import { prisma } from "@/db/db";
import { Guild as DbGuild } from "@prisma/client";
import { Snowflake } from "discord.js";

type DbGuildSettings = Omit<DbGuild, "id">;

export default class Guild {
    private guildId: Snowflake;

    constructor(guildId: Snowflake) {
        this.guildId = guildId;
    }

    public async fetch(): Promise<DbGuild> {
        return prisma.guild.upsert({
            where: {
                id: this.guildId,
            },
            create: {
                id: this.guildId,
            },
            update: {},
        });
    }

    public async setSetting<T extends keyof DbGuildSettings>(setting: T, value: DbGuildSettings[T]): Promise<DbGuild> {
        return prisma.guild.upsert({
            where: {
                id: this.guildId,
            },
            create: {
                id: this.guildId,
            },
            update: {
                [setting]: value,
            },
        });
    }
}
