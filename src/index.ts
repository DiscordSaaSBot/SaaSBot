import {REST} from "discord.js";
import {Routes} from "discord-api-types/v10";
import {glob} from "glob";
import {fileURLToPath} from "node:url";
import {join, dirname, resolve} from "node:path";
import SlashCommand from "./modules/SlashCommand.js";
import EventHandler from "./modules/EventHandler.js";
import CustomClient from "./modules/CustomClient.js";

(await import("dotenv")).config({path: ".env"});

const dirName: string = dirname(fileURLToPath(import.meta.url));

async function registerFiles<T>
(subFolder: string, callback: (ctor: new (...args: any[]) => T) => void) {
	for (const handlerCtor of await glob(join(dirName, subFolder) + "/**/*")) {
		// do this to avoid unresolved route in WebStorm.
		const moduleName: string = `file://${resolve(handlerCtor)}`;
		callback((await import(moduleName)).default);
	}
}

const client: CustomClient = new CustomClient();

client.commands = [];
await registerFiles<SlashCommand>("commands", (ctor): void => {
	client.commands.push(new (<any>ctor)(client));
});

await (new REST()
	.setToken(<string>process.env.DISCORD_TOKEN)
	.put(
		Routes.applicationCommands(<string>process.env.DISCORD_CLIENT_ID),
		{ body: client.commands.map((c: SlashCommand) => c.build.toJSON()) }
	));

await registerFiles<EventHandler>("events", (ctor): void => {
	const eventInstance: EventHandler = new (<any>ctor)(client);
	client.on(eventInstance.eventType, eventInstance.invoke.bind(eventInstance));
});

await client.login(<string>process.env.DISCORD_TOKEN);

