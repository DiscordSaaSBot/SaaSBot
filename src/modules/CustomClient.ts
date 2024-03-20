import {Client} from "discord.js";
import SlashCommand from "./SlashCommand.js";

export default class CustomClient extends Client {
	public commands: SlashCommand[] = [];

	public constructor() {
		super({
			intents: 32767
		});
	}
}