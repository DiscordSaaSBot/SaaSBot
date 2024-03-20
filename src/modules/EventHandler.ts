import {ClientEvents} from "discord.js";

export default abstract class EventHandler {
	public abstract get eventType(): keyof ClientEvents;
	public abstract invoke(): void | Promise<void>;
}