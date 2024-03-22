import {Event} from "../modules/handlers/HandlerBuilders.js";
import { Events, GuildMember} from "discord.js";
import { logger } from "../modules/utils/logger.js";
import updateStats from "../modules/utils/updateStats.js";

export default new Event({
	event: Events.GuildMemberRemove,

	async handler(member: GuildMember): Promise<void> {
		logger.info(`The user ${member.user.tag} has left the server ${member.guild.name} with ID ${member.guild.id} on ${member.joinedAt}, and their account was created on ${member.user.createdAt}`);
		await updateStats(this, member)
	}
});