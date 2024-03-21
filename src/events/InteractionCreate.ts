import EventHandler from "../modules/handlers/EventHandler.js";
import {
	SlashCommand,
	UserCommand,
	RawInteraction
} from "../modules/handlers/InteractionHandlers.js";
import {
	ChatInputCommandInteraction,
	ClientEvents,
	CommandInteraction,
	Events, SlashCommandBuilder
} from "discord.js";

export default class extends EventHandler {
	public get eventType(): keyof ClientEvents {
		return Events.InteractionCreate;
	}

	public async invoke(interaction: CommandInteraction): Promise<void> {
		if (interaction.isChatInputCommand()) {
			// const command: SlashCommand | undefined = this.client.commands
			// 	.find((c: unknown): boolean =>
			// 		c instanceof SlashCommand &&
			// 		c.build.name === interaction.commandName
			// 	)
			//
			// if (command !== undefined)
			// 	command.invoke(<ChatInputCommandInteraction>interaction);
		} else if (interaction.isUserContextMenuCommand()) {

		}
	}
}