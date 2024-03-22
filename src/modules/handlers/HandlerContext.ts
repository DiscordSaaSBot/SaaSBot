import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Interaction,
	SelectMenuInteraction,
	UserContextMenuCommandInteraction
} from "discord.js";
import CustomClient from "../CustomClient.js";

export interface BaseContext {
	client: CustomClient;
}

export interface CommandContext<TInteraction extends Interaction> extends BaseContext {
	context: TInteraction;
}

export type SlashCommandContext = CommandContext<ChatInputCommandInteraction>;
export type UserCommandContext = CommandContext<UserContextMenuCommandInteraction>;
export type ButtonContext = CommandContext<ButtonInteraction>;
export type SelectMenuContext = CommandContext<SelectMenuInteraction>;


export type EventContext = BaseContext;