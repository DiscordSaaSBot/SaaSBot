import EventHandler from "../modules/handlers/EventHandler.js";
import {ClientEvents, Events} from "discord.js";

export default class extends EventHandler {
	public get eventType(): keyof ClientEvents {
		return Events.ClientReady;
	}

	public invoke(): void{
		console.log("Client Ready!");
	}
}