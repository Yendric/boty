const { SlashCommand } = require('slash-create');
const client = require('../../index.js');
const { MessageEmbed } = require('discord.js');

module.exports = class PauseCommand extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'queue',
			description: 'Bekijk de wachtrij.',
		});
	}

	async run(ctx) {
		ctx.defer();
		const queue = client.music.queue.get(ctx.guildID);
		const songs = queue?.songs;
		if (!songs) return ctx.send('Geen liedjes in de queue');
		const embed = new MessageEmbed()
			.setTitle('Queue');

		for (const [index, song] of songs.entries()) {
			embed.addField(index == 0 ? 'Nu speelt: **' + song.title + '**' : index + '. **' + song.title + '**', song.url);
		}

		return ctx.send({ embeds: [embed] });
	}
};