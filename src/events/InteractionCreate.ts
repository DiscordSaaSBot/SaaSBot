import {
	CommandTypes,
	Event,
	SlashCommand,
	UserCommand,
	SelectMenuInteraction as InternalSelectMenuInteraction,
	ComponentTypes
} from "../modules/handlers/HandlerBuilders.js";
import {
	ButtonInteraction,
	ChatInputCommandInteraction,
	Events,
	Interaction,
	SelectMenuInteraction,
	UserContextMenuCommandInteraction
} from "discord.js";

export default new Event({
	event: Events.InteractionCreate,

	handler(interaction: Interaction): void {
		let command: CommandTypes | ComponentTypes | undefined = undefined;

		if (interaction instanceof ChatInputCommandInteraction) {
			command = <SlashCommand>this.client.commands
				.find((i: CommandTypes): boolean =>
					i instanceof SlashCommand
					&& i.parameters.builder.name === interaction.commandName
				)

			command.context = {
				context: interaction,
				client: this.client
			}
		} else if (interaction instanceof UserContextMenuCommandInteraction) {
			command = <UserCommand>this.client.commands
				.find((i: CommandTypes): boolean =>
					i instanceof UserCommand
					&& i.parameters.builder.name === interaction.commandName
				)

			command.context = {
				context: interaction,
				client: this.client
			}
		} else if (
			interaction instanceof SelectMenuInteraction
			|| interaction instanceof ButtonInteraction
		) {
			command = <InternalSelectMenuInteraction>this.client.components
				.find((i: ComponentTypes): boolean =>
					i.parameters.componentId === interaction.customId
				)
		}

		command?.parameters.handler.bind(command?.context)();
	}
});