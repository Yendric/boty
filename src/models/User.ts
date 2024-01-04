import { prisma } from "@/db/db";
import { calculateLevelFromXp } from "@/utils/levels";
import { User as DbUser } from "@prisma/client";
import { Snowflake } from "discord.js";

type UserLevelData = {
    level: number;
    xp: number;
    messages: number;
    progress: number;
};

export default class User {
    private userId: Snowflake;

    constructor(userId: Snowflake) {
        this.userId = userId;
    }

    public async fetch(): Promise<DbUser> {
        return prisma.user.upsert({
            where: {
                id: this.userId,
            },
            create: {
                id: this.userId,
            },
            update: {},
        });
    }

    public async incrementXp(amount: number): Promise<DbUser> {
        return prisma.user.upsert({
            where: {
                id: this.userId,
            },
            create: {
                id: this.userId,
            },
            update: {
                xp: {
                    increment: amount,
                },
            },
        });
    }

    public async incrementMessages(): Promise<DbUser> {
        return prisma.user.upsert({
            where: {
                id: this.userId,
            },
            create: {
                id: this.userId,
            },
            update: {
                messages: {
                    increment: 1,
                },
            },
        });
    }

    /**
     * The level formula is the following: level(xp) = 0.0625 * sqrt(xp) + 1
     * Therefore:                          xp(level) = ((level - 1) * 16) ^ 2
     * And:                                xp(level + 1) = ((level) * 16) ^ 2
     */
    public async getLevelData(): Promise<UserLevelData> {
        const { xp, messages } = await this.fetch();

        const level = calculateLevelFromXp(xp);

        const levelStartXp = Math.floor(((level - 1) * 16) ** 2);
        const levelEndXp = Math.floor((level * 16) ** 2);
        const progress = (xp - levelStartXp) / (levelEndXp - levelStartXp);

        return {
            level,
            xp,
            messages,
            progress,
        };
    }
}
