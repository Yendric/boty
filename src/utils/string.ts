export function validURL(url: string) {
    return new RegExp(
        "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?",
    ).test(url);
}

export function generateProgressBar(progress: number, length: number) {
    const filled = Math.round(progress * length);
    const emptied = length - filled;

    return `${"🟩".repeat(filled)}${"🟥".repeat(emptied)}`;
}
