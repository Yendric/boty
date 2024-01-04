export function validURL(url: string) {
    return new RegExp(
        "([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?"
    ).test(url);
}

export function snakeToCamal(string: string) {
    return string
        .toLowerCase()
        .replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace("-", "").replace("_", ""));
}

export function generateProgressBar(progress: number, length: number) {
    const filled = Math.round(progress * length);
    const emptied = length - filled;

    return `${"#".repeat(filled)}${"-".repeat(emptied)}`;
}

// Source: https://stackoverflow.com/questions/44195322/
export function htmlDecode(encoded: string) {
    const translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    const translate: Record<string, string> = {
        nbsp: " ",
        amp: "&",
        quot: '"',
        lt: "<",
        gt: ">",
    };
    return encoded
        .replace(translate_re, function (_, entity) {
            return translate[entity] ?? "";
        })
        .replace(/&#(\d+);/gi, function (_, numStr) {
            var num = parseInt(numStr, 10);
            return String.fromCharCode(num);
        });
}
