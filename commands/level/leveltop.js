const { SlashCommand } = require('slash-create');
const client = require('../../index.js');
const { MessageEmbed } = require('discord.js');

module.exports = class LevelTopCommand extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'leveltop',
			description: 'Toont de tien beste gamers.',
		});
	}

	async run(ctx) {
		ctx.defer();
		const guild = client.guilds.cache.get(ctx.guildID);

		const filtered = this.client.storage.points.filter(p => p.guild === guild.id).array();

		const sorted = filtered.sort((a, b) => b.xp - a.xp);

		const top10 = sorted.splice(0, 10);

		const embed = new MessageEmbed()
			.setTitle('Leveltop')
			.setDescription('Top 10 gamers!')
			.setColor(0x00AE86);
		for (const [i, data] of top10.entries()) {
			embed.addField('#' + i + 1, `<@${data.user}>: ${data.xp} XP (level ${data.level})`);
		}
		return ctx.send({ embeds: [embed] });
	}
};
