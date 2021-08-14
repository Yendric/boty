const Discord = require("discord.js");

exports.run = async (client, msg, args) => {
    let [prop, ...value] = args;
    let parts = prop.split(".");
    if ((parts.length === 2 && !(client.storage.defaultServerSettings.hasOwnProperty(parts[0]) && client.storage.defaultServerSettings[parts[0]].hasOwnProperty(parts[1]))) || parts.length === 1 && (!client.storage.defaultServerSettings.hasOwnProperty(parts[0])))
        return msg.reply("Die optie bestaat niet.");

    if (prop.includes("channels.")) {
        let channel = msg.guild.channels.cache.find(channel => channel.name === value.join(" ")) || msg.mentions.channels.first() || msg.guild.channels.cache.get(value.join(" "));
        if (channel && (channel.type === "text" || channel.type === "category")) {
            client.storage.settings.set(msg.guild.id, channel.id, prop);
            msg.channel.send(`Instelling voor ${prop} is veranderd naar: ${channel}`);
        } else {
            msg.reply("Dat tekstkanaal bestaat niet.");
        }
    } else if (prop.includes("roles.")) {
        let role = msg.guild.roles.cache.find(role => role.name === value.join(" ")) || msg.mentions.roles.first() || msg.guild.roles.cache.get(value.join(" "));
        if (role) {
            client.storage.settings.set(msg.guild.id, role.id, prop);
            msg.channel.send(`Instelling voor ${prop} is veranderd naar: ${role}`);
        } else {
            msg.reply("Die role bestaat niet.");
        }
    } else {
        client.storage.settings.set(msg.guild.id, value.join(" "), prop);
        msg.channel.send(`Instelling voor ${prop} is veranderd naar: \`${value.join(" ")}\``);
    }
}

exports.conf = {
    enabled: true,
    aliases: ["setconfig"],
    guildOnly: false,
    permLevel: 2
};

exports.help = {
    name: "set",
    description: "Stel config variabelen in voor jouw server!",
    usage: "set [setting] [value]"
}