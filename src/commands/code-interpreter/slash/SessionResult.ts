import {SlashCommand} from "../../../modules/handlers/HandlerBuilders.js";
import {EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {CreateRunnerResponse} from "../utils/ApiTypes.js";
import {checkRunnerDetails, checkRunnerStatus, getResultEmbed} from "../utils/RunnerUtils.js";

export default new SlashCommand({
	builder: new SlashCommandBuilder()
		.setName("code-session")
		.setDescription("Get data from code sessions")
		.addSubcommand(c => c
			.setName("get-result")
			.setDescription("Get result from a long running session")
			.addStringOption(o => o
				.setName("id")
				.setDescription("The session ID")
				.setRequired(true)
			)
		),

	async handler(): Promise<void> {
		await this.context.deferReply();
		const sessionId: string = this.context.options.getString("id")!;

		const status: CreateRunnerResponse = await checkRunnerStatus(sessionId);

		if (status.status === "running") {
			const timeoutEmbed: EmbedBuilder = new EmbedBuilder()
				.setTitle("On it!")
				.setDescription(
					"This runner is still running," +
					"please, wait and run this command again in a few seconds"
				)
				.addFields(
					{name: "Session ID", value: status.id, inline: true},
					{name: "Status", value: status.status, inline: true}
				)
				.setColor("#FFA500")

			await this.context.editReply({
				embeds: [timeoutEmbed]
			});
			return;
		}

		await this.context.editReply({
			embeds: [getResultEmbed(await checkRunnerDetails(sessionId))]
		});
	}
})