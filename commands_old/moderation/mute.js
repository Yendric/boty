const Discord = require("discord.js");

exports.run = async (client, msg, args) => {
    if (!msg.guild.me.hasPermission("MANAGE_ROLES")) return msg.reply("Ik heb hier geen toestemming voor :(");
    if (!args[0]) return msg.reply("Geen gebruiker opgegeven");
}

exports.conf = {
    aliases: [],
    permLevel: 1
};

exports.help = {
    name: "mute",
    description: "Mute iemand",
    usage: "mute [@gebruiker]"
}
