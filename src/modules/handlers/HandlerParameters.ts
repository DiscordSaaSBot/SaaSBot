import {Events, Interaction, SlashCommandBuilder} from "discord.js";
import {BaseContext, ButtonContext, CommandContext, EventContext, SelectMenuContext} from "./HandlerContext.js";

export interface BaseParameters<TThis extends BaseContext> {
	handler: (this: TThis, ...params: any[]) => Promise<void> | void;
}

export interface CommandParameters<TInteraction extends Interaction>
	extends BaseParameters<CommandContext<TInteraction>> {

	builder: SlashCommandBuilder;
}

export interface EventParameters
	extends BaseParameters<EventContext> {

	event: Events;
}

export interface ComponentParameters<TInteraction extends (ButtonContext | SelectMenuContext)>
	extends BaseParameters<TInteraction> {

	componentId: string;
}