import { SlashCommand } from "../../modules/handlers/HandlerBuilders.js";
import { ChannelType, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { logger } from "../../modules/utils/logger.js";

export default new SlashCommand({
	builder: new SlashCommandBuilder()
		.setName("setup-stats")
		.setDescription("Setear el canal de estadísticas del servidor")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	async handler(): Promise<void> {
		const guildId = this.context.guildId;
		if (!guildId) {
			await this.context.reply("No se ha podido obtener el ID del servidor");
			logger.error("No se ha podido obtener el ID del servidor");
			return;
		}
		const guild = this.client.guilds.cache.get(guildId);
		if (!guild) {
			await this.context.reply("No se ha podido obtener el servidor");
			logger.error("No se ha podido obtener el servidor");
			return;
		}
		const categoryExists = guild.channels.cache.find(
			(channel) =>
				channel.type === ChannelType.GuildCategory && channel.name === "Estadisticas"
		);
		if (categoryExists) {
			await this.context.reply("Ya existe una categoría de estadísticas en el servidor");
			return;
		}
		const category = await guild.channels.create({
			name: "Estadisticas",
			type: ChannelType.GuildCategory,
			position: 0
		});

		if (!category) {
			await this.context.reply("No se ha podido crear la categoría de estadísticas");
			logger.error(
				"Error creating the category in the setup-stats command for the guild " +
					guild.name +
					" with ID " +
					guild.id
			);
			return;
		}

		const totalMembers = guild.memberCount;
		await guild.members.fetch();
		const totalUsers = guild.members.cache.filter((member) => !member.user.bot).size;
		const totalBots = guild.members.cache.filter((member) => member.user.bot).size;

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
		});

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
		});

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
		});

		await this.context.reply(`Canal de estadísticas creado correctamente`);
	}
});
