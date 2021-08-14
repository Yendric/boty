const { Command } = require('discord.js-commando');

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'say',
            group: 'util',
            memberName: 'say',
            description: 'Laat de bot iets zeggen.',
            userPermission: 'MANAGE_GUILD',
            guildOnly: true,
            args: [
                {
                    key: 'tekst',
                    prompt: 'Wat moet de bot zeggen?',
                    type: 'string'
                }
            ]
        });
    }

    async run(msg, args) {
        msg.delete().catch(e => console.log(e));
        msg.say(args.tekst);
    }
};