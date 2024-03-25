import { SlashCommand } from "../../modules/handlers/HandlerBuilders.js";
import { SlashCommandBuilder } from "discord.js";

export default new SlashCommand({
	builder: new SlashCommandBuilder().setName("test").setDescription("this is a test command!"),

	async handler(): Promise<void> {
		await this.context.reply("This is a test!");
	}
});
