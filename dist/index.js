import { glob } from "glob";
import { fileURLToPath } from "node:url";
import { join, dirname, resolve } from "node:path";
import SlashCommand from "./modules/Command.js";
(await import("dotenv")).config({ path: ".env" });
const dirName = dirname(fileURLToPath(import.meta.url));
async function getSubFolder(name) {
    return glob(join(dirName, name) + "/**/*");
}
// export const client: Client = new Client({
// 	intents: 32767
// });
const commands = new Set();
for (const command of await getSubFolder("commands")) {
    const module = (await import(`file://${resolve(command)}`)).default;
    if (module instanceof SlashCommand)
        commands.add(module);
}
for (const command of commands) {
    console.log(command.Build.name);
}
