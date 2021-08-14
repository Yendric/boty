const { SlashCommand, CommandOptionType } = require('slash-create');
const { MessageEmbed } = require('discord.js');
const client = require('../../index');

module.exports = class LevelCommand extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'level',
			description: 'Bekijk het level van een gebruiker.',
			options: [{
				type: CommandOptionType.USER,
				name: 'gebruiker',
				description: 'Van welke gebruiker? (standaard: jij)',
				required: false,
			}],
		});
	}

	async run(ctx) {
		ctx.defer();
		const gebruiker = ctx.options.gebruiker;
		const guild = client.guilds.cache.get(ctx.guildID);
		const user = gebruiker ? gebruiker : guild.members.cache.get(ctx.member.id);
		const key = `${guild.id}-${user.id}`;

		client.storage.points.ensure(key, {
			user: user.id,
			guild: guild.id,
			xp: 0,
			messages: 0,
			level: 1,
		});

		const userLevel = client.storage.points.get(key, 'level');
		const xpUser = client.storage.points.get(key, 'xp');
		const nextLevelXp = userLevel * userLevel * 300;
		const prevLevelXp = (userLevel - 1) * (userLevel - 1) * 300;
		const percentage = Math.round(((xpUser - prevLevelXp) / (nextLevelXp - prevLevelXp)) * 100);
		const messages = client.storage.points.get(key, 'messages');

		const levelEmbed = new MessageEmbed()
			.setAuthor(`${guild.name} | Level info van ${user.username}`)
			.setDescription(`Level: **${userLevel}**\nXP: **${xpUser}**\nBerichten verzonden: **${messages}**`)
			.setThumbnail(user.displayAvatarURL())
			.setColor('#33aaff')
			.setFooter(`Je bent op ${percentage}% naar level ${userLevel + 1}!`);

		ctx.send({ embeds: [levelEmbed] });
	}
};