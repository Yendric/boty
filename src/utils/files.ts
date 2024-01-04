import { readdirSync, statSync } from "fs";
import { resolve } from "path";

export function getFiles(dir: string): string[] {
    return readdirSync(resolve(__dirname, "..", dir)).flatMap((file) => {
        if (statSync(resolve(__dirname, "..", dir, file)).isDirectory()) {
            return getFiles(dir + "/" + file);
        }

        return dir + "/" + file;
    });
}
