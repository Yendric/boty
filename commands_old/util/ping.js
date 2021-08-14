const { Command } = require('discord.js-commando');
const { MessageEmbed } = require("discord.js");

module.exports = class PlayCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ping',
            group: 'util',
            memberName: 'ping',
            description: 'Check de ping.',
            guildOnly: true
        });
    }

    async run(msg, args) {
          msg.channel.send('Ping meten...').then (async (msg1) =>{
            msg1.delete();
            msg.channel.send(`🏓Latency: ${msg1.createdTimestamp - msg.createdTimestamp}ms. API Latency: ${Math.round(this.client.ws.ping)}ms`);
          })
    }
};