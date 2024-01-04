export function calculateLevelFromXp(xp: number) {
    return Math.floor(0.0625 * Math.sqrt(xp) + 1);
}
