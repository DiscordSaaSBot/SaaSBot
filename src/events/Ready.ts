import {Event} from "../modules/handlers/HandlerBuilders.js";
import {ActivityOptions, ActivityType, Events} from "discord.js";
import {logger} from "../modules/utils/logger.js";
import {EventContext} from "../modules/handlers/HandlerContext.js";

const presences: ActivityOptions[] = [
	{ name: "your SaaS projects", type: ActivityType.Watching },
	{ name: "for your contributions", type: ActivityType.Listening },
	{ name: "with your SaaS project", type: ActivityType.Playing }
];

export default new Event({
	event: Events.ClientReady,

	handler(): void {
		let currentStatus: number = 0;
		function changeStatus(this: EventContext): void {
			this.client.user!.setActivity(
				presences[currentStatus + 1 === presences.length ? 0 : currentStatus++]
			);
		}

		setInterval(changeStatus.bind(this), 3600000 * 5);
		changeStatus.call(this);

		logger.info("Client ready!");
	}
});