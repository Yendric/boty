const { Command } = require('discord.js-commando');

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'seek',
            aliases: ['se'],
            group: 'music',
            memberName: 'seek',
            description: 'Ga naar een tijdstip.',
            args: [
                {
                    key: 'tijdstip',
                    prompt: 'Vul het tijdstip in in seconden.',
                    type: 'integer'
                }
            ]
        });
    }

    async run(msg, args) {
        return this.client.music.seek(msg, args.tijdstip, msg.guild);
    }
};