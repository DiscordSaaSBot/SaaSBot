import { Client } from "discord.js";
import { CommandTypes, ComponentTypes } from "./handlers/HandlerBuilders.js";

export default class CustomClient extends Client {
	public commands: CommandTypes[] = [];
	public components: ComponentTypes[] = [];

	public constructor() {
		super({
			intents: 32767
		});
	}
}
