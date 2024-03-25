import { Events, Interaction, SlashCommandSubcommandsOnlyBuilder } from "discord.js";
import {
	BaseContext,
	ButtonContext,
	CommandContext,
	EventContext,
	SelectMenuContext
} from "./HandlerContext.js";

export type BaseParameters<TThis extends BaseContext> = {
	handler: (this: TThis, ...params: any[]) => Promise<void> | void;
};

export type CommandParameters<TInteraction extends Interaction> = {
	builder: SlashCommandSubcommandsOnlyBuilder;
} & BaseParameters<CommandContext<TInteraction>>;

export type EventParameters = {
	event: Events;
} & BaseParameters<EventContext>;

export type ComponentParameters<TInteraction extends ButtonContext | SelectMenuContext> = {
	componentId: string;
} & BaseParameters<TInteraction>;
