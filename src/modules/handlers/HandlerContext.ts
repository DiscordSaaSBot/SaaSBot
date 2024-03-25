import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Interaction,
	SelectMenuInteraction,
	UserContextMenuCommandInteraction
} from "discord.js";
import CustomClient from "../CustomClient.js";

export type BaseContext = {
	client: CustomClient;
};

export type CommandContext<TInteraction extends Interaction> = {
	context: TInteraction;
} & BaseContext;

export type SlashCommandContext = CommandContext<ChatInputCommandInteraction>;
export type UserCommandContext = CommandContext<UserContextMenuCommandInteraction>;
export type ButtonContext = CommandContext<ButtonInteraction>;
export type SelectMenuContext = CommandContext<SelectMenuInteraction>;

export type EventContext = BaseContext;
