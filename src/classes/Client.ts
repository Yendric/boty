import Command from "@/classes/Command";
import EventHandler from "@/classes/EventHandler";
import Logger from "@/services/Logger";
import { MessageType } from "@/types";
import { getFiles } from "@/utils/files";
import { ClientEvents, Collection, Client as DiscordClient, EmbedBuilder, Events } from "discord.js";

export default class Client extends DiscordClient {
    public commands = new Collection<string, Command>();

    public async start(token: string) {
        this.loadCommands();
        this.registerEventHandlers();
        this.once(Events.ClientReady, (readyClient) => {
            this.onReady(readyClient).catch((error) => Logger.error(`Registreren van commands mislukt: ${error}`));
        });

        await this.login(token);
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
        for (const file of getFiles("events")) {
            // eslint-disable-next-line @typescript-eslint/no-require-imports -- dynamische CJS-loader
            const eventHandler = require(`../${file}`).default as EventHandler<keyof ClientEvents> | undefined;
            if (!eventHandler?.event || !eventHandler.execute) {
                Logger.error(`Bestand ${file} bevat geen geldige event handler.`);
                continue;
            }

            const listener = (...args: ClientEvents[keyof ClientEvents]) => void eventHandler.execute(this, args);
            if (eventHandler.once) {
                this.once(eventHandler.event, listener);
            } else {
                this.on(eventHandler.event, listener);
            }

            Logger.log(`Event geladen: ${file}`);
        }
    }

    private loadCommands() {
        for (const file of getFiles("commands")) {
            // eslint-disable-next-line @typescript-eslint/no-require-imports -- dynamische CJS-loader
            const command = require(`../${file}`).default as Command | undefined;
            if (!command?.data || !command.execute) {
                Logger.error(`Bestand ${file} bevat geen geldig command.`);
                continue;
            }

            this.commands.set(command.data.name, command);
            Logger.log(`Command geladen: ${file}`);
        }
    }

    private async onReady(readyClient: DiscordClient<true>) {
        await readyClient.application.commands.set(this.commands.map((command) => command.data.toJSON()));

        Logger.log(`Online in ${readyClient.guilds.cache.size} servers.`);
        Logger.log(
            `Invite link: https://discord.com/oauth2/authorize?client_id=${readyClient.user.id}&scope=bot&permissions=8`,
        );
    }
}
