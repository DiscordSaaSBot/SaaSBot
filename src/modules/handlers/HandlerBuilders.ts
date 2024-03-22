import {
	BaseParameters,
	CommandParameters,
	ComponentParameters,
	EventParameters
} from "./HandlerParameters.js";
import {
	BaseContext,
	ButtonContext,
	EventContext,
	SelectMenuContext,
	SlashCommandContext,
	UserCommandContext
} from "./HandlerContext.js";
import {ChatInputCommandInteraction, UserContextMenuCommandInteraction} from "discord.js";

export abstract class BaseBuilder
	<TContext extends BaseContext, TParameters extends BaseParameters<TContext>> {

	private _context: TContext;
	private readonly _parameters: TParameters;

	public constructor(parameters: TParameters) {
		this._parameters = parameters;
	}

	public set context(context: TContext) {
		this._context = context;
	}

	public get context(): TContext {
		return this._context;
	}

	public get parameters(): TParameters {
		return this._parameters;
	}
}

export type CommandTypes = SlashCommand | UserCommand;

export class SlashCommand extends BaseBuilder
	<SlashCommandContext, CommandParameters<ChatInputCommandInteraction>> {}

export class UserCommand extends BaseBuilder
	<UserCommandContext, CommandParameters<UserContextMenuCommandInteraction>> {}

export type ComponentTypes = ButtonInteraction | SelectMenuInteraction;

export class ButtonInteraction extends BaseBuilder
	<ButtonContext, ComponentParameters<ButtonContext>> {}

export class SelectMenuInteraction extends BaseBuilder
	<SelectMenuContext, ComponentParameters<SelectMenuContext>> {}

export class Event extends BaseBuilder
	<EventContext, EventParameters> {}