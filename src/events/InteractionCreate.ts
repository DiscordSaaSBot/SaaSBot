import EventHandler from "../modules/handlers/EventHandler.js";
import SlashCommand from "../modules/handlers/SlashCommand.js";
import {
	ChatInputCommandInteraction,
	ClientEvents,
	CommandInteraction,
	Events
} from "discord.js";

export default class extends EventHandler {
	public get eventType(): keyof ClientEvents {
		return Events.InteractionCreate;
	}

	public async invoke(interaction: CommandInteraction): Promise<void> {
		if (interaction.isChatInputCommand()) {
			const command: SlashCommand | undefined = this.client.commands
				.find(c => c.build.name === interaction.commandName)

			if (command !== undefined)
				command.invoke(<ChatInputCommandInteraction>interaction);
		}
	}
}