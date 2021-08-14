const { stripIndents, oneLine } = require('common-tags');
const { Command } = require("discord.js-commando");

module.exports = class HelpCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'help',
            group: 'util',
            memberName: 'help',
            aliases: ['commands'],
            description: 'Toont een lijst met beschikbare commando\'s.',
            details: oneLine`
                Het commando kan een deel van een commandonaam zijn of een hele commandonaam.
                Als het niet wordt opgegeven, worden alle beschikbare commando's opgesomd.
			`,
            examples: ['help', 'help prefix'],
            guarded: true,

            args: [
                {
                    key: 'command',
                    prompt: 'Voor welk commando heb je hulp nodig?',
                    type: 'string',
                    default: ''
                }
            ]
        });
    }

    async run(msg, args) {
        const groups = this.client.registry.groups;
        const commands = this.client.registry.findCommands(args.command, false, msg);
        const showAll = args.command && args.command.toLowerCase() === 'all';
        if (args.command && !showAll) {
            if (commands.length === 1) {
                let help = stripIndents`
					${oneLine`
						__Command **${commands[0].name}**:__ ${commands[0].description}
						${commands[0].guildOnly ? ' (Alleen bruikbaar in servers)' : ''}
						${commands[0].nsfw ? ' (NSFW)' : ''}
					`}

					**Format:** ${msg.anyUsage(`${commands[0].name}${commands[0].format ? ` ${commands[0].format}` : ''}`)}
				`;
                if (commands[0].aliases.length > 0) help += `\n**Aliases:** ${commands[0].aliases.join(', ')}`;
                help += `\n${oneLine`
					**Group:** ${commands[0].group.name}
					(\`${commands[0].groupID}:${commands[0].memberName}\`)
				`}`;
                if (commands[0].details) help += `\n**Details:** ${commands[0].details}`;
                if (commands[0].examples) help += `\n**Voorbeelden:**\n${commands[0].examples.join('\n')}`;

                const messages = [];
                try {
                    messages.push(await msg.direct(help));
                    if (msg.channel.type !== 'dm') messages.push(await msg.reply('DM met informatie verstuurd.'));
                } catch (err) {
                    messages.push(await msg.reply('DM Sturen mislukt, staan DMs aan?'));
                }
                return messages;
            } else if (commands.length > 15) {
                return msg.reply('Er zijn te veel commando\'s, wees specifieker.');
            } else if (commands.length > 1) {
                return msg.reply(disambiguation(commands, 'commands'));
            } else {
                return msg.reply(
                    `Commando niet gevonden. Gebruik ${msg.usage(
                        null, msg.channel.type === 'dm' ? null : undefined, msg.channel.type === 'dm' ? null : undefined
                    )} om een lijst met alle commando's te zien.`
                );
            }
        } else {
            const messages = [];
            try {
                messages.push(await msg.direct(stripIndents`
					${oneLine`
						Om een commando in ${msg.guild ? msg.guild.name : 'elke server'} uit te voeren,
						gebruik ${Command.usage('command', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
						Bijvoorbeeld, ${Command.usage('prefix', msg.guild ? msg.guild.commandPrefix : null, this.client.user)}.
					`}
					Om dit commando in een DM uit te voeren, gebruik ${Command.usage('command', null, null)} zonder prefix.

					Gebruik ${this.usage('<command>', null, null)} voor informatie over een specifiek commando.
					Gebruik ${this.usage('all', null, null)} om een lijst met *alle* commando's te zien, niet enkel de beschikbare.

					__**${showAll ? 'Alle commando\'s' : `Beschikbare commando's in ${msg.guild || 'deze DM'}`}**__

					${groups.filter(grp => grp.commands.some(cmd => !cmd.hidden && (showAll || cmd.isUsable(msg))))
                        .map(grp => stripIndents`
							__${grp.name}__
							${grp.commands.filter(cmd => !cmd.hidden && (showAll || cmd.isUsable(msg)))
                                .map(cmd => `**${cmd.name}:** ${cmd.description}${cmd.nsfw ? ' (NSFW)' : ''}`).join('\n')
                            }
						`).join('\n\n')
                    }
				`, { split: true }));
                if (msg.channel.type !== 'dm') messages.push(await msg.reply('DM met informatie verstuurd.'));
            } catch (err) {
                messages.push(await msg.reply('DM Sturen mislukt, staan DMs aan?'));
            }
            return messages;
        }
    }
};