import {ClientEvents} from "discord.js";
import BaseHandler from "./BaseHandler.js";

/**
 * Abstract definition of an event, this class must be
 * always extended by event handlers, otherwise these will
 * be ignored.
 * */
export default abstract class EventHandler extends BaseHandler {
	/**
	 * Get the associated event for this handler.
	 * @returns {string}
	 * */
	public abstract get eventType(): keyof ClientEvents;

	/**
	 * What the event is supposed to do.
	 * @returns {void | Promise<void>}
	 * */
	public abstract invoke(...args: any[]): void | Promise<void>;
}