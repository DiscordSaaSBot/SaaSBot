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
	EmbedBuilder,
	Events,
	Interaction,
	SelectMenuInteraction,
	UserContextMenuCommandInteraction
} from "discord.js";
import { logger, notifyError } from "@modules/utils/logger.js";

export default new Event({
	event: Events.InteractionCreate,

	handler(interaction: Interaction): void {
		let command: CommandTypes | ComponentTypes | undefined = undefined;
		let interactionIdentifier: string = "unknown";
		let interactionType: string = "unknown";

		if (interaction instanceof ChatInputCommandInteraction) {
			command = <SlashCommand>(
				this.client.commands.find(
					(i: CommandTypes): boolean =>
						i instanceof SlashCommand &&
						i.parameters.builder.name === interaction.commandName
				)
			);

			command.context = {
				context: interaction,
				client: this.client
			};

			interactionIdentifier =
				`/${interaction.commandName} ` +
					`${interaction.options.getSubcommandGroup ?? ""} ` +
					interaction.options.getSubcommand ?? "";
			interactionType = "slash command";
		} else if (interaction instanceof UserContextMenuCommandInteraction) {
			command = <UserCommand>(
				this.client.commands.find(
					(i: CommandTypes): boolean =>
						i instanceof UserCommand &&
						i.parameters.builder.name === interaction.commandName
				)
			);

			command.context = {
				context: interaction,
				client: this.client
			};

			interactionIdentifier = interaction.commandName;
			interactionType = "user command";
		} else if (
			interaction instanceof SelectMenuInteraction ||
			interaction instanceof ButtonInteraction
		) {
			command = <InternalSelectMenuInteraction>(
				this.client.components.find(
					(i: ComponentTypes): boolean =>
						i.parameters.componentId === interaction.customId
				)
			);

			interactionIdentifier = interaction.customId;
			interactionType = "message component";
		}

		new Promise<void>((resolve, reject) => {
			try {
				const handlerResult: Promise<void> | void = command?.parameters.handler.bind(
					command?.context
				)();

				if (handlerResult instanceof Promise) {
					handlerResult.then(resolve).catch(reject);

					return;
				}

				resolve();
			} catch (error: any) {
				reject(error);
			}
		})
			.then((): void => {
				logger.info(
					`${interactionType} triggered by ${interaction.user.globalName} |> ${interactionIdentifier}`
				);
			})
			.catch(async (error: Error) => {
				logger.error(
					`${interactionType} triggered by ${interaction.user.globalName} caught an error` +
						` |> ${interactionIdentifier}\n${error}`
				);

				// required for type guarding...
				if (
					!(
						interaction instanceof ChatInputCommandInteraction ||
						interaction instanceof UserContextMenuCommandInteraction ||
						interaction instanceof SelectMenuInteraction ||
						interaction instanceof ButtonInteraction
					)
				)
					return;

				const errorEmbed: EmbedBuilder = new EmbedBuilder()
					.setTitle("Internal error")
					.setDescription(
						"Whoops, looks like there was an error while replying to your interaction, " +
							"don't worry this error has been notified and we are doing everything in our hands to solve it."
					)
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
			});
	}
});
