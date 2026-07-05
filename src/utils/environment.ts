export function getEnvVariable(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`.env variable ${key} niet gevonden.`);
    }
    return value;
}
