const { SlashCommand } = require('slash-create');
const client = require('../../index.js');

module.exports = class SkipCommand extends SlashCommand {
	constructor(creator) {
		super(creator, {
			name: 'skip',
			description: 'Skip muziek.',
		});
	}

	async run(ctx) {
		ctx.defer();
		if (!client.guilds.cache.get(ctx.guildID).members.cache.get(ctx.member.id)?.voice?.channel) return ctx.send('Je moet in een voice channel zijn om de muziek te stoppen!');
		if (!client.music.queue.get(ctx.guildID)) return ctx.send('Er speelt geen liedje!');
		client.music.queue.get(ctx.guildID).connection.destroy();
		return ctx.send('Liedje geskipt.');
	}
};