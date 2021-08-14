const Discord = require("discord.js");

exports.run = async (client, msg, args) => {
    if (!msg.guild.me.hasPermission("KICK_MEMBERS")) return msg.reply("Ik heb hier geen toestemming voor :(");
    if (!args[0]) return msg.reply("Geen gebruiker opgegeven");
    if (!args[1]) return msg.reply("Geen reden opgegeven");

    let user = msg.mentions.members.first() || msg.guild.members.get(args[0]);
    let reason = args.slice(1).join(" ");
    if (!user) return msg.reply("Gebruiker niet gevonden.");

    let kickEmbed = new Discord.MessageEmbed()
        .setTitle(`${msg.guild.name} | Moderatie`)
        .setDescription(`Wil je ${user} kicken?`)
        .setColor("#00ff00")
        .setFooter(`Opgevraagd door ${msg.member.displayName}`);

    let kickedEmbed = new Discord.MessageEmbed()
        .setTitle(`${msg.guild.name} | Moderatie`)
        .setDescription(`**Gekicked: ${user}**
        **Door:** ${msg.author}
        **Reden:** ${reason}`)
        .setColor("#ff0000")
        .setTimestamp()
        .setFooter(`Opgevraagd door ${msg.member.displayName}`);

    msg.channel.send(kickEmbed).then(async (message) => {
        let emoji = await kickMessage(message, msg.author, 30, ["✅", "❌"]);

        if (emoji === "✅") {
            user.kick(reason).catch(e => msg.reply("Er is iets fout gelopen"));
            msg.channel.send(kickedEmbed);
        } else if (emoji === "❌") {
            msg.reply("Kick geannuleerd");
        }
    });


}

exports.conf = {
    aliases: [],
    permLevel: 1
};

exports.help = {
    name: "kick",
    description: "Kick iemand",
    usage: "kick [@gebruiker] [reden]"
}

async function kickMessage(msg, author, time, reactions) {
    time *= 1000;

    for (const reaction of reactions) {
        await msg.react(reaction);
    }

    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    return msg.awaitReactions(filter, { max: 1, time: time }).then(reaction => reaction.first() && reaction.first().emoji.name);
}