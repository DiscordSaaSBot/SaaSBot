import { SlashCommand } from "../../modules/handlers/HandlerBuilders.js";
import { ChannelType, SlashCommandBuilder } from "discord.js";
import { logger } from "../../modules/utils/logger.js";

export default new SlashCommand({
	builder: new SlashCommandBuilder()
		.setName("setup-stats")
		.setDescription("Setear el canal de estadísticas del servidor"),

	async handler(): Promise<void> {
		const guildId = this.context.guildId;
		if (!guildId) { 
			this.context.reply("No se ha podido obtener el ID del servidor"); 
			logger.error("No se ha podido obtener el ID del servidor");
			return; 
		}
		const guild = this.client.guilds.cache.get(guildId)
		if (!guild) { 
			this.context.reply("No se ha podido obtener el servidor"); 
			logger.error("No se ha podido obtener el servidor");
			return; 
		}
		const categoryExists = guild.channels.cache.find(channel => channel.type === ChannelType.GuildCategory && channel.name === "Estadisticas")
		if (categoryExists) {
			this.context.reply("Ya existe una categoría de estadísticas en el servidor")
			return
		}
		const category = await guild.channels.create({
			name: "Estadisticas",
			type: ChannelType.GuildCategory,
			position: 1,
            
		})

		const totalMembers = guild.memberCount
		const totalUsers = guild.members.cache.filter(member => !member.user.bot).size
		const totalBots = guild.members.cache.filter(member => member.user.bot).size

		await guild.channels.create({
			name: "Miembros totales: " + totalMembers,
			type: ChannelType.GuildVoice,
			parent: category,
			permissionOverwrites: [
				{
					id: guild.roles.everyone.id,
					deny: ["Connect"]
				}
			]
		})

		await guild.channels.create({
			name: "Miembros: " + totalUsers,
			type: ChannelType.GuildVoice,
			parent: category,
			permissionOverwrites: [
				{
					id: guild.roles.everyone.id,
					deny: ["Connect"]
				}
			]
		})

		await guild.channels.create({
			name: "Bots: " + totalBots,
			type: ChannelType.GuildVoice,
			parent: category,
			permissionOverwrites: [
				{
					id: guild.roles.everyone.id,
					deny: ["Connect"]
				}
			]
		})

		this.context.reply(`Canal de estadísticas creado en la categoría ${category}`)
	}
});