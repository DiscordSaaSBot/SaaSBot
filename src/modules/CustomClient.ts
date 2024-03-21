import {Client} from "discord.js";
import {RawInteraction} from "./handlers/InteractionHandlers.js";

export default class CustomClient extends Client {
	public commands: RawInteraction<any>[] = [];

	public constructor() {
		super({
			intents: 32767
		});
	}
}