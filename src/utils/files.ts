import { readdirSync, statSync } from "fs";

export function getFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((file) => {
    file = dir + "/" + file;
    if (statSync(file).isDirectory()) return getFiles(file);
    return file;
  });
}
