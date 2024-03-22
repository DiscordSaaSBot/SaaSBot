import {ClientEvents, REST} from "discord.js";
import {Routes} from "discord-api-types/v10";
import {glob} from "glob";
import {fileURLToPath} from "node:url";
import {join, dirname, resolve} from "node:path";
import CustomClient from "./modules/CustomClient.js";
import {
	CommandTypes,
	SlashCommand,
	Event,
	ComponentTypes,
	UserCommand
} from "./modules/handlers/HandlerBuilders.js";

(await import("dotenv")).config({path: ".env"});

const dirName: string = dirname(fileURLToPath(import.meta.url));

async function registerFiles<T>
(subFolder: string, callback: (imported: T) => void) {
	for (const handlerCtor of await glob(join(dirName, subFolder) + "/**/*.js")) {
		// do this to avoid unresolved route in WebStorm.
		const moduleName: string = `file://${resolve(handlerCtor)}`;
		callback((await import(moduleName)).default);
	}
}

const client: CustomClient = new CustomClient();

client.commands = [];
await registerFiles<CommandTypes | ComponentTypes>("commands", (imported: CommandTypes | ComponentTypes): void => {
	if (imported instanceof SlashCommand || imported instanceof UserCommand)
		client.commands.push(imported); // these get registered
	else {
		client.components.push(imported); // these don't
	}
});

await (new REST()
	.setToken(<string>process.env.DISCORD_TOKEN)
	.put(
		Routes.applicationCommands(<string>process.env.DISCORD_CLIENT_ID),
		{
			body: client.commands.map((c: CommandTypes) => c.parameters.builder.toJSON())
		}
	));

await registerFiles<Event>("events", (imported: Event): void => {
	imported.context = {
		client
	}

	client.on(
		<keyof ClientEvents>imported.parameters.event,
		imported.parameters.handler.bind(imported.context)
	);
});

await client.login(<string>process.env.DISCORD_TOKEN);

