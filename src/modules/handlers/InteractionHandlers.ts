import {
	BaseInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	ContextMenuCommandBuilder,
	SlashCommandBuilder,
	UserContextMenuCommandInteraction,
} from "discord.js";
import BaseHandler from "./BaseHandler.js";

export abstract class RawInteraction<TContext extends BaseInteraction> extends BaseHandler {
	/**
	 * Provides access to the received command.
	 *
	 * @type {BaseInteraction}
	 * */
	protected context?: TContext

	public invoke(context: TContext): void {
	    this.context = context;
	    this.run();
	}

	/**
	 * This is the command handler, to respond to this
	 * command check the class instance with the {this} keyword.
	 * */
	protected abstract run(): void | Promise<void>;
}

export abstract class BuildableInteraction
<TContext extends BaseInteraction, TBuild extends SlashCommandBuilder | ContextMenuCommandBuilder>
extends RawInteraction<TContext> {
	/**
	 * This getter should provide the discord.js command
	 * definition
	 *
	 * @returns {SlashCommandBuilder | ContextMenuCommandBuilder}
	 * */
	public abstract get build(): TBuild;
}

/**
 * Abstract definition of a slash command, this
 * class must be extended by any slash command
 * handler, otherwise the handler will be ignored.
 * */
export abstract class SlashCommand extends BuildableInteraction<ChatInputCommandInteraction, SlashCommandBuilder> {}

/**
 * Abstract definition of a user command, this
 * class must be extended by any user command
 * handler, otherwise the handler will be ignored.
 * */
export abstract class UserCommand
	extends BuildableInteraction<UserContextMenuCommandInteraction, ContextMenuCommandBuilder>{}

export abstract class ComponentInteraction<TContext extends BaseInteraction> extends RawInteraction<TContext> {
	/**
	 * This is the component ID for your interaction,
	 * the interaction handler will match the component
	 * id with this and run the matching handler.
	 * */
	public abstract get componentId(): string;
}

/**
 * Abstract definition of a button interaction, this
 * class must be extended by any button interaction
 * handler, otherwise the handler will be ignored.
 * */
export type ButtonComponentInteraction = ComponentInteraction<ButtonInteraction>;

// you can handle more interaction types here.