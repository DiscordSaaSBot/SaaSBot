import CustomClient from "./CustomClient.js";

export default abstract class BaseHandler {
	/**
	 * Provides access to the client instance that
	 * called this handler.
	 *
	 * @type {CustomClient}
	 * */
	protected client: CustomClient;

	protected constructor(client: CustomClient) {
		this.client = client;
	}
}