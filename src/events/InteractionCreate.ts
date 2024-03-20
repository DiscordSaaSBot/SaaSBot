import EventHandler from "../modules/EventHandler.js";
import SlashCommand from "../modules/SlashCommand.js";
import {
	ChatInputCommandInteraction,
	ClientEvents,
	CommandInteraction,
	Events
} from "discord.js";

export default class extends EventHandler {
	get eventType(): keyof ClientEvents {
		return Events.InteractionCreate;
	}

	async invoke(interaction: CommandInteraction): Promise<void> {
		if (interaction.isChatInputCommand()) {
			const command: SlashCommand | undefined = this.client.commands
				.find(c => c.build.name === interaction.commandName)

			if (command !== undefined)
				command.invoke(<ChatInputCommandInteraction>interaction);
		}
	}
}