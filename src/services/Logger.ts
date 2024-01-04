import { MessageType } from "@/types";

export default class Logger {
    public static log(message: string, logType: MessageType = MessageType.Info) {
        const timeString = new Date().toLocaleTimeString();

        if (logType == MessageType.Info) {
            console.info(`[INFO] [${timeString}] ${message}`);
        } else if (logType == MessageType.Success) {
            console.log(`\x1b[32m[INFO] [${timeString}] ${message}`);
        } else {
            console.error(`\x1b[31m[ERROR] [${timeString}] ${message}`);
        }
    }

    public static error(message: string) {
        Logger.log(message, MessageType.Error);
    }

    public static success(message: string) {
        Logger.log(message, MessageType.Success);
    }

    public static info(message: string) {
        Logger.log(message, MessageType.Info);
    }
}
