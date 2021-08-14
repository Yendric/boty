const { SlashCommand } = require('slash-create');
const client = require('../../index.js');

module.exports = class ResumeCommand extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'resume',
			description: 'Hervat muziek.',
		});
	}

	async run(ctx) {
		ctx.defer();
		const serverQueue = client.music.queue.get(ctx.guildID);
		if (!client.guilds.cache.get(ctx.guildID).members.cache.get(ctx.member.id)?.voice?.channel) return ctx.send('Je moet in een voice channel zijn om de muziek te hervatten!');
		if (!serverQueue) return ctx.send('Er speelt geen liedje!');
		ctx.send('Muziek hervat.');
		serverQueue.connection.dispatcher.resume();
	}
};