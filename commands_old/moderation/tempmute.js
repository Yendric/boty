const Discord = require("discord.js");

exports.run = async (client, msg, args) => {
    if (!msg.guild.me.hasPermission("MANAGE_ROLES")) return msg.reply("Ik heb hier geen toestemming voor :(");
    if (!args[0]) return msg.reply("Geen gebruiker opgegeven");
    if (!args[1]) return msg.reply("Geen tijd opgegeven");
}

exports.conf = {
    aliases: [],
    permLevel: 1
};

exports.help = {
    name: "tempmute",
    description: "Tempmute iemand",
    usage: "tempmute [@gebruiker] [tijd]"
}
