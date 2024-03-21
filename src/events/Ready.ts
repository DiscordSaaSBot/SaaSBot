import EventHandler from "../modules/handlers/EventHandler.js";
import {ClientEvents, Events} from "discord.js";
import { logger } from "../utils/logger.js";

export default class extends EventHandler {
	public get eventType(): keyof ClientEvents {
		return Events.ClientReady;
	}

	public invoke(): void{
		logger.info("Client Ready!")
	}
}