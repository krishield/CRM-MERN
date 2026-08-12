import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, "..", ".env");

const DEFAULT_USER = "admin";
const DEFAULT_PASS_HASH = "$2b$10$MmyAvmeEmVS4Pkif5WkP7ushzOoi3MTouCj8wQb8XpyS8LimyhqGO"; // bcrypt hash of "9595"

let lines = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf-8").split("\n") : [];

const setLine = (key, value) => {
    let found = false;
    lines = lines.map((line) => {
        if (line.startsWith(`${key}=`)) {
            found = true;
            return `${key}=${value}`;
        }
        return line;
    });
    if (!found) lines.push(`${key}=${value}`);
};

setLine("ADMIN_USER", DEFAULT_USER);
setLine("ADMIN_PASS_HASH", DEFAULT_PASS_HASH);

fs.writeFileSync(envPath, lines.filter((line) => line.length > 0).join("\n") + "\n");

console.log(`Login reset. Username: ${DEFAULT_USER}  Password: 9595`);
