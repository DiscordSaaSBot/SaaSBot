import {
	Client,
	CommandInteraction,
	SlashCommandBuilder,
} from "discord.js";

export default abstract class SlashCommand {
	protected client: Client;
	protected context?: CommandInteraction

	protected constructor(client: Client) {
		this.client = client;
	}

	public abstract get build(): SlashCommandBuilder;
	protected abstract run(): void | Promise<void>;

	public invoke(context: CommandInteraction): void {
		this.context = context;
		this.run();
	}
}