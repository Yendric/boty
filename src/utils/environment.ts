export function getEnvVariable(key: string) {
    if (!process.env[key]) {
        throw new Error(`.env variable ${key} niet gevonden.`);
    }
    return process.env[key] as string;
}
