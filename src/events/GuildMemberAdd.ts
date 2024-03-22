import {Event} from "../modules/handlers/HandlerBuilders.js";
import {ChannelType, Events, GuildMember} from "discord.js";
import { logger } from "../modules/utils/logger.js";

export default new Event({
	event: Events.GuildMemberAdd,

	handler(member: GuildMember): void {
		logger.info(`The user ${member.user.tag} has joined the server ${member.guild.name} with ID ${member.guild.id} on ${member.joinedAt}, and their account was created on ${member.user.createdAt}`);
		const guildId = member.guild.id;
		const guild = this.client.guilds.cache.get(guildId)
		const statsCategory = guild?.channels.cache.find(channel => channel.type === ChannelType.GuildCategory && channel.name === "Estadisticas")
		if (!guild) { 
			logger.error("Error getting the guild from the cache in the GuildMemberAdd event handler for the user " + member.user.tag + " with ID " + member.user.id);
			return; 
		}
		if(member.user.bot) {
			const botsChannel = guild.channels.cache.find(channel => channel.name.includes("Bots:") && channel.parentId === statsCategory?.id)
			if(!botsChannel) {
				logger.error("Error getting the Bots channel from the cache in the GuildMemberAdd event handler for the user " + member.user.tag + " with ID " + member.user.id);
			}
			botsChannel?.edit({name: "Bots: " + guild.members.cache.filter(member => member.user.bot).size})
		}
		else{
			const usersChannel = guild.channels.cache.find(channel => channel.name.includes("Miembros:") && channel.parentId === statsCategory?.id)
			if(!usersChannel) {
				logger.error("Error getting the Miembros channel from the cache in the GuildMemberAdd event handler for the user " + member.user.tag + " with ID " + member.user.id);
			}
			usersChannel?.edit({name: "Miembros: " + guild.members.cache.filter(member => !member.user.bot).size})
		}
		const allMembersChannel = guild.channels.cache.find(channel => channel.name.includes("Miembros totales") && channel.parentId === statsCategory?.id)
		if(!allMembersChannel) {
			logger.error("Error getting the Miembros totales channel from the cache in the GuildMemberAdd event handler for the user " + member.user.tag + " with ID " + member.user.id);
		}
		allMembersChannel?.edit({name: "Miembros totales: " + guild.memberCount})
		
	}
});