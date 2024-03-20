import {
	ChatInputCommandInteraction,
	SlashCommandBuilder,
} from "discord.js";
import BaseHandler from "./BaseHandler.js";

/**
 * Abstract definition of a slash command, this
 * class must be extended by any slash command
 * handler, otherwise the handler will be ignored.
 * */
export default abstract class SlashCommand extends BaseHandler {
	/**
	 * Provides access to the received command.
	 *
	 * @type {ChatInputCommandInteraction}
	 * */
	protected context?: ChatInputCommandInteraction

	/**
	 * This getter should provide the discord.js command
	 * definition
	 *
	 * @returns {SlashCommandBuilder}
	 * */
	public abstract get build(): SlashCommandBuilder;

	/**
	 * This is the command handler, to respond to this
	 * command check the class instance with the {this} keyword.
	 * */
	protected abstract run(): void | Promise<void>;

	public invoke(context: ChatInputCommandInteraction): void {
		this.context = context;
		this.run();
	}
}