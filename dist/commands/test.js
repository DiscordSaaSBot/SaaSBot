import SlashCommand from "../modules/SlashCommand.js";
import { SlashCommandBuilder } from "discord.js";
export default class extends SlashCommand {
    get build() {
        return new SlashCommandBuilder()
            .setName("test")
            .setDescription("yes this is a test!");
    }
    async run() {
        await this.context.reply("yes!");
    }
}
