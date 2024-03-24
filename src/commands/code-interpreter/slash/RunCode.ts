import { SlashCommand } from "../../../modules/handlers/HandlerBuilders.js";
import { Attachment, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { CreateRunnerResponse, GetRunnerDetails } from "../utils/ApiTypes.js";
import {
	checkRunnerDetails,
	checkRunnerStatus,
	getResultEmbed,
	extensions
} from "../utils/RunnerUtils.js";

export default new SlashCommand({
	builder: new SlashCommandBuilder()
		.setName("run-code")
		.setDescription("Code running category")
		.addSubcommand((c) =>
			c
				.setName("from-file")
				.setDescription("Run code from a file you upload")
				.addAttachmentOption((o) =>
					o
						.setName("file")
						.setDescription(
							"The file to run the code from, the language will be inferred from the file extension"
						)
						.setRequired(true)
				)
				.addStringOption((o) =>
					o.setName("stdin").setDescription("Pass input to the code interpreter.")
				)
		)
		.addSubcommand((c) =>
			c
				.setName("from-input")
				.setDescription("Run code directly from your command input")
				.addStringOption((o) =>
					o.setName("code").setDescription("The script to run.").setRequired(true)
				)
				.addStringOption((o) =>
					o
						.setName("language")
						.setDescription("The coding language the script is written on")
						.setRequired(true)
						.addChoices(
							{ name: "C | C17/clang10", value: "c" },
							{ name: "C++ | C++17/clang10", value: "cpp" },
							{ name: "Java | OpenJDK18", value: "java" },
							{ name: "Kotlin | 1.7.10/JRE18", value: "kotlin" },
							{ name: "Swift | 5.6.2", value: "swift" },
							{ name: "C# | Mono 6", value: "csharp" },
							{ name: "Go | 1.19", value: "go" },
							{ name: "Python 3 | 3.8.10", value: "python3" },
							{ name: "Ruby | 3.1.2p20", value: "ruby" },
							{ name: "PHP | 8.1.9 cli", value: "php" },
							{ name: "BASH | 5.0.17", value: "bash" },
							{ name: "RLang | 3.6.3", value: "r" },
							{ name: "JavaScript | NodeJS 16.17.0", value: "javascript" },
							{ name: "Visual Basic | Mono 6", value: "vb" },
							{ name: "BrainFuck", value: "brainfuck" },
							{ name: "Cobol | cobc 2.2.0", value: "cobol" },
							{ name: "F# | F# Interactive 4.0", value: "fsharp" },
							{ name: "Elixir | 1.12.3", value: "elixir" },
							{ name: "Rust | rustc 1.59.0", value: "rust" },
							{ name: "TypeScript | 4.8.2", value: "typescript" }
						)
				)
				.addStringOption((o) =>
					o.setName("stdin").setDescription("Pass input to the code interpreter.")
				)
		),

	async handler(): Promise<void> {
		let code: string;
		let language: string;
		const stdin: string | null = this.context.options.getString("stdin");

		if (this.context.options.getSubcommand() === "from-file") {
			const file: Attachment = this.context.options.getAttachment("file")!;
			code = await fetch(file.url).then((f) => f.text());

			const splitName: string[] = file.name.split(".");

			if (
				splitName.length < 2 ||
				!Object.keys(extensions).includes(splitName[splitName.length - 1])
			) {
				const unknownLangEmbed: EmbedBuilder = new EmbedBuilder()
					.setTitle("Invalid language")
					.setDescription(
						"Inferred language is not valid, valid languages include:\n\n```" +
							Object.keys(extensions)
								.map((e) => `*.${e}`)
								.join(", ") +
							"```"
					)
					.setColor("#FF0000");

				await this.context.reply({
					embeds: [unknownLangEmbed],
					ephemeral: true
				});
				return;
			}

			language = extensions[splitName[splitName.length - 1]];
		} else {
			code = this.context.options.getString("code")!;
			language = this.context.options.getString("language")!;
		}

		await this.context.deferReply();

		const createRunnerResult: CreateRunnerResponse = await fetch(
			"http://api.paiza.io/runners/create?" +
				`source_code=${encodeURIComponent(code)}&` +
				`language=${encodeURIComponent(language)}&` +
				"api_key=guest&" +
				(stdin !== null ? `input=${encodeURIComponent(stdin)}` : ""),
			{ method: "POST" }
		).then((r) => r.json());

		setTimeout(async (): Promise<void> => {
			const checkRunnerResult: CreateRunnerResponse = await checkRunnerStatus(
				createRunnerResult.id
			);

			if (checkRunnerResult.status === "running") {
				const timeoutEmbed: EmbedBuilder = new EmbedBuilder()
					.setTitle("Long running session!")
					.setDescription(
						"Looks like this session is going to take some time," +
							"but don't worry you can still use the </run-code get-output:1221193746209701920>" +
							"command and check the output for this session once it's finished!"
					)
					.addFields(
						{ name: "Session ID", value: checkRunnerResult.id, inline: true },
						{ name: "Status", value: checkRunnerResult.status, inline: true }
					)
					.setColor("#FFA500");

				await this.context.editReply({ embeds: [timeoutEmbed] });
				return;
			}

			const getRunnerResult: GetRunnerDetails = await checkRunnerDetails(
				createRunnerResult.id
			);

			await this.context.editReply({
				embeds: [getResultEmbed(getRunnerResult)]
			});
		}, 3000);
	}
});
