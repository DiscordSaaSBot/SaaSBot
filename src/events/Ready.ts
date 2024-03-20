import EventHandler from "../modules/EventHandler.js";
import {ClientEvents, Events} from "discord.js";

export default class extends EventHandler {
	get eventType(): keyof ClientEvents {
		return Events.ClientReady;
	}

	invoke(): void{
		console.log("Client Ready!");
	}
}