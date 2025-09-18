export function sanitizeInput(input) {
    if (typeof input === "string") {
        return input.trim().replace(/\$/g, "").replace(/\./g, "");
    }
    return input;
}