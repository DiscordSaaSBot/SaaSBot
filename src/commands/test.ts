import SlashCommand, { CommandBuilder } from "../modules/Command.js";
import {SlashCommandBuilder} from "discord.js";

export default class extends SlashCommand {
    public get Build(): CommandBuilder {
        return new SlashCommandBuilder()
            .setName("test");
    }

    public run(): void | Promise<void> {

    }
}