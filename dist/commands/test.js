import SlashCommand from "../modules/Command.js";
import { SlashCommandBuilder } from "discord.js";
export default class extends SlashCommand {
    get Build() {
        return new SlashCommandBuilder()
            .setName("test");
    }
    run() {
    }
}
