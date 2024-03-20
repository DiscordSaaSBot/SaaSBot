import {
	Client, CommandInteraction,
	RESTPostAPIChatInputApplicationCommandsJSONBody,
	SlashCommandBuilder,
	SlashCommandSubcommandsOnlyBuilder
} from "discord.js";

export type CommandBuilder
	= RESTPostAPIChatInputApplicationCommandsJSONBody
	| Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">
	| SlashCommandSubcommandsOnlyBuilder

export default abstract class SlashCommand {
	protected client: Client;
	protected context?: CommandInteraction

	public constructor(client: Client) {
		this.client = client;
	}

	public abstract get Build(): CommandBuilder;
	protected abstract run(): void | Promise<void>;

	public invoke(context: CommandInteraction): void {
		this.context = context;
		this.run();
	}
}