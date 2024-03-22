import { ChannelType, GuildMember } from "discord.js";
import { logger } from "./logger.js";
import { BaseContext } from "../handlers/HandlerContext.js";

export default async function updateStats(context: BaseContext, member: GuildMember) {
	const guildId = member.guild.id;
	const guild = context.client.guilds.cache.get(guildId)
	const statsCategory = guild?.channels.cache.find(channel => channel.type === ChannelType.GuildCategory && channel.name === "Estadisticas")
	if (!guild) { 
		logger.error("Error getting the guild from the cache in the GuildMemberAdd event handler for the user " + member.user.tag + " with ID " + member.user.id);
		return; 
	}
	if(member.user.bot) {
		const botsChannel = guild.channels.cache.find(channel => channel.name.includes("Bots:") && channel.parentId === statsCategory?.id)
		if(!botsChannel) {
			logger.error("Error getting the Bots channel from the cache in the GuildMemberAdd event handler for the user " + member.user.tag + " with ID " + member.user.id);
			return;
		}
		await botsChannel.edit({name: "Bots: " + guild.members.cache.filter(member => member.user.bot).size})
	}
	else{
		const usersChannel = guild.channels.cache.find(channel => channel.name.includes("Miembros:"))
        
		if(!usersChannel) {
			logger.error("Error getting the Miembros channel from the cache in the GuildMemberAdd event handler for the user " + member.user.tag + " with ID " + member.user.id);
			return;
		}
		await usersChannel.edit({name: "Miembros: " + guild.members.cache.filter(member => !member.user.bot).size})
	}
	const allMembersChannel = guild.channels.cache.find(channel => channel.name.includes("Miembros totales:"))
	if(!allMembersChannel) {
		logger.error("Error getting the Miembros totales channel from the cache in the GuildMemberAdd event handler for the user " + member.user.tag + " with ID " + member.user.id);
		return;
	}
	await allMembersChannel.edit({name: "Miembros totales: " + guild.memberCount})
	return 
}

