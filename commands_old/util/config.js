const Discord = require("discord.js");

exports.run = async (client, msg, params) => {
    let conf = client.storage.settings.get(msg.guild.id);
    msg.channel.send(`De huidige server configuratie: \`\`\`js\n${JSON.stringify(conf, undefined, 2)} \`\`\``);
}

exports.conf = {
    aliases: [],
    permLevel: 0
};

exports.help = {
    name: "config",
    description: "Toont de huidige server configuratie.",
    usage: "config"
} 