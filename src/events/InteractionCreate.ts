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
	ChatInputCommandInteraction, EmbedBuilder,
	Events,
	Interaction,
	SelectMenuInteraction,
	UserContextMenuCommandInteraction
} from "discord.js";
import {logger, notifyError} from "../modules/utils/logger.js";

export default new Event({
	event: Events.InteractionCreate,

	async handler(interaction: Interaction): Promise<void> {
		let command: CommandTypes | ComponentTypes | undefined = undefined;
		let interactionIdentifier: string = "unknown";
		let interactionType: string = "unknown";

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

			interactionIdentifier = interaction.commandName;
			interactionType = "slash command";
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

			interactionIdentifier = `/${interaction.commandName}`;
			interactionType = "user command";
		} else if (
			interaction instanceof SelectMenuInteraction
			|| interaction instanceof ButtonInteraction
		) {
			command = <InternalSelectMenuInteraction>this.client.components
				.find((i: ComponentTypes): boolean =>
					i.parameters.componentId === interaction.customId
				)

			interactionIdentifier = interaction.customId;
			interactionType = "message component"
		}

		try {
			command?.parameters.handler.bind(command?.context)();
			logger.info(
				`${interaction.user.globalName} |> ${interactionType} triggered |> ${interactionIdentifier}`
			);
		} catch (error: any) {
			logger.error(
				`${interaction.user.globalName} |> ${interactionType} triggered |> ${interactionIdentifier}\n${error}`
			);

			// required for type guarding...
			if (!(interaction instanceof ChatInputCommandInteraction
				|| interaction instanceof UserContextMenuCommandInteraction
				|| interaction instanceof SelectMenuInteraction
				|| interaction instanceof ButtonInteraction))
				return;

			const errorEmbed: EmbedBuilder = new EmbedBuilder()
				.setTitle("Internal error")
				.setDescription("Whoops, looks like there was an error while replying to your interaction, " +
					"don't worry this error has been notified and we are doing everything in our hands to solve it.")
				.setColor("#FF0000");

			if (!interaction.replied && !interaction.deferred) {
				await interaction.reply({
					embeds: [errorEmbed]
				});
				return;
			}

			await interaction.followUp({
				embeds: [errorEmbed]
			});

			notifyError(error);
		}
	}
});