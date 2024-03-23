import {CreateRunnerResponse, GetRunnerDetails} from "./ApiTypes.js";
import {EmbedBuilder} from "discord.js";

export const extensions: Record<string, string> = {
	"c": "c",
	"cpp": "cpp",
	"java": "java",
	"kt": "kotlin",
	"swift": "swift",
	"cs": "csharp",
	"go": "go",
	"py": "python3",
	"rb": "ruby",
	"php": "php",
	"sh": "bash",
	"r": "r",
	"js": "javascript",
	"vb": "vb",
	"bf": "brainfuck",
	"cob": "cobol",
	"fs": "fsharp",
	"ex": "elixir",
	"rs": "rust",
	"ts": "typescript"
}

export async function checkRunnerDetails(id: string): Promise<GetRunnerDetails> {
	return await fetch(`http://api.paiza.io/runners/get_details?id=${encodeURIComponent(id)}&api_key=guest`)
		.then(r => r.json());
}

export async function checkRunnerStatus(id: string): Promise<CreateRunnerResponse> {
	return await fetch(`http://api.paiza.io/runners/get_status?id=${encodeURIComponent(id)}&api_key=guest`)
		.then(r => r.json());
}

export function getResultEmbed(details: GetRunnerDetails): EmbedBuilder {
	if (details.build_result !== "success" && details.build_result !== null) {
		return new EmbedBuilder()
			.setTitle("Build error")
			.setDescription(`Session ID: \`${details.id}\`\n\`\`\`${details.build_stderr ?? details.build_stdout}\`\`\``)
			.setColor("#FF0000")
			.setFooter({text: `Exited with code: ${details.build_exit_code}`});
	}

	if (details.result !== "success") {
		return new EmbedBuilder()
			.setTitle("Runtime error")
			.setDescription(`Session ID: \`${details.id}\`\n\`\`\`${details.stderr ?? details.stdout}\`\`\``)
			.setColor("#FF0000")
			.setFooter({text: `Exited with code: ${details.exit_code}`});
	}

	return new EmbedBuilder()
		.setTitle("Success")
		.setDescription(`Session ID: \`${details.id}\`\n\`\`\`${details.stdout}\`\`\``)
		.setColor("#00B000")
		.setFooter({text: `Exited with code: ${details.exit_code}`});
}