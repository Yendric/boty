import EventHandler from "@/classes/EventHandler";
import { getFiles } from "@/utils/files";
import { ClientOptions, Collection, Client as DiscordClient, EmbedBuilder, REST, Routes } from "discord.js";
import Command from "./Command";
import { MessageType } from "@/types";
import Logger from "@/services/Logger";

export default class Client extends DiscordClient {
    public commands = new Collection<string, Command>();

    constructor(token: string, options: ClientOptions) {
        super(options);

        this.login(token);
        this.registerEventHandlers();
        this.loadCommands();
        this.on("ready", this.registerCommands);
        this.on("ready", this.logReady);
    }

    public static embed(messageType: MessageType = MessageType.Info): EmbedBuilder {
        const colors = {
            [MessageType.Info]: 0x33aaff,
            [MessageType.Success]: 0x00ff00,
            [MessageType.Error]: 0xff0000,
        };

        return new EmbedBuilder()
            .setTitle("Boty")
            .setColor(colors[messageType])
            .setTimestamp(new Date())
            .setFooter({ text: `Boty v${process.env.npm_package_version}` });
    }

    private registerEventHandlers() {
        getFiles("events").forEach(async (file) => {
            const eventHandler = require("../" + file).default as EventHandler<any>;

            if (eventHandler.once) {
                this.once(eventHandler.event, async (...args) => await eventHandler.execute(this, args));
            } else {
                this.on(eventHandler.event, async (...args) => await eventHandler.execute(this, args));
            }

            Logger.log(`Loaded event: ${file}`);
        });
    }

    private loadCommands() {
        getFiles("commands").forEach(async (file) => {
            const interaction = require("../" + file).default as Command;
            this.commands.set(interaction.data.name, interaction);

            Logger.log(`Loaded command: ${file}`);
        });
    }

    private async registerCommands() {
        if (!this.token) throw new Error("Token is verdwenen.");
        if (!this.user) throw new Error("Application ID niet gevonden (besta ik wel??).");

        const rest = new REST().setToken(this.token);

        await rest.put(Routes.applicationCommands(this.user?.id), {
            body: this.commands.map((command) => command.data),
        });
    }

    private logReady() {
        Logger.log(`Online in ${this.guilds.cache.size} servers.`);
        Logger.log(
            `Invite link: https://discord.com/oauth2/authorize?client_id=${this.user?.id}&scope=bot&permissions=8`
        );
    }
}
