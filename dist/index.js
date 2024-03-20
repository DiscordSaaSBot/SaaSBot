import { Client, REST } from "discord.js";
import { Routes } from "discord-api-types/v10";
import { glob } from "glob";
import { fileURLToPath } from "node:url";
import { join, dirname, resolve } from "node:path";
(await import("dotenv")).config({ path: ".env" });
const dirName = dirname(fileURLToPath(import.meta.url));
async function registerFiles(subFolder, callback) {
    for (const handlerCtor of await glob(join(dirName, subFolder) + "/**/*")) {
        // do this to avoid unresolved route in WebStorm.
        const moduleName = `file://${resolve(handlerCtor)}`;
        callback((await import(moduleName)).default);
    }
}
const client = new Client({
    intents: 32767
});
const commands = [];
await registerFiles("commands", (ctor) => {
    commands.push(new ctor(client));
});
await (new REST()
    .setToken(process.env.DISCORD_TOKEN)
    .put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands.map((c) => c.build.toJSON()) }));
await registerFiles("events", (ctor) => {
    const eventInstance = new ctor();
    client.on(eventInstance.eventType, eventInstance.invoke);
});
await client.login(process.env.DISCORD_TOKEN);
