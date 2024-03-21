import InteractionHandlers from "../../modules/handlers/InteractionHandlers.js";
import {SlashCommandBuilder} from "discord.js";

export default class extends InteractionHandlers {
	public get build(): SlashCommandBuilder {
		return new SlashCommandBuilder()
			.setName("test")
			.setDescription("yes this is a test!");
	}

	public async run(): Promise<void> {
		await this.context!.reply("yes!")
	}
}