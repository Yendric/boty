const Discord = require("discord.js");

exports.run = async (client, msg, args) => {
    client.storage.settings.set(msg.guild.id, client.storage.defaultServerSettings);
    msg.reply('Serverconfig is gereset!');
}

exports.conf = {
    enabled: true,
    aliases: ["resetconfig"],
    guildOnly: false,
    permLevel: 3
};

exports.help = {
    name: "reset",
    description: "Reset serverconfig!",
    usage: "reset"
}