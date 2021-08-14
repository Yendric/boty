const { SlashCommand, CommandOptionType } = require('slash-create');
const { MessageEmbed } = require('discord.js');
const client = require('../../index');

module.exports = class ClearCommand extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'clear',
			description: 'Verwijder berichten.',
			options: [{
				type: CommandOptionType.INTEGER,
				name: 'aantal',
				description: 'Hoeveel berichten wil je verwijderen (1-99)?',
				required: true,
			}],
		});
	}

	async run(ctx) {
		ctx.defer();
		const guild = client.guilds.cache.get(ctx.guildID);
		const channel = client.channels.cache.get(ctx.channelID);
		const hoeveelheid = ctx.options.aantal;

		if(hoeveelheid < 1 || hoeveelheid > 99) return ctx.send('Kies een getal van 1 tot 99!');

		const embed = new MessageEmbed()
			.setTitle(`${guild.name} | Moderatie`)
			.setTimestamp()
			.setFooter(`Opgevraagd door ${ctx.member.displayName}`);

		try {
			await channel.bulkDelete(hoeveelheid);
			const berichtMessage = hoeveelheid == 1 ? 'bericht' : 'berichten';
			await ctx.send({ embeds: [
				embed
					.setColor('#00ff00')
					.setDescription(`${hoeveelheid} ${berichtMessage} verwijderd.`),
			] });
			setTimeout(ctx.delete, 5000);
		}
		catch(err) {
			await ctx.send({ embeds: [
				embed
					.setColor('#ff0000')
					.setDescription('Er is iets misgegaan (zijn er berichten ouder dan 14 dagen?).'),
			] });
			setTimeout(ctx.delete, 5000);
		}
	}
};