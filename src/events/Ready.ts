import {Event} from "../modules/handlers/HandlerBuilders.js";
import {Events} from "discord.js";
import {logger} from "../modules/utils/logger.js";

export default new Event({
	event: Events.ClientReady,

	handler(): void {
		logger.info("Client ready!");
	}
});