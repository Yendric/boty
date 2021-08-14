const Discord = require("discord.js");

exports.run = async (client, msg, args) => {
    if (!msg.guild.me.hasPermission("BAN_MEMBERS")) return msg.reply("Ik heb hier geen toestemming voor :(");
    if (!args[0]) return msg.reply("Gelieve een snowflake op te geven");

    let user = await client.users.fetch(args[0]).catch(e => { return null });
    if (!user) return msg.reply('Gelieve een snowflake op te geven');

    let banEmbed = new Discord.MessageEmbed()
        .setTitle(`${msg.guild.name} | Moderatie`)
        .setDescription(`Wil je ${user} unbannen?`)
        .setColor("#00ff00")
        .setFooter(`Opgevraagd door ${msg.member.displayName}`);

    let bannedEmbed = new Discord.MessageEmbed()
        .setTitle(`${msg.guild.name} | Moderatie`)
        .setDescription(`**Unbanned: ${user}**
        **Door:** ${msg.author}`)
        .setColor("#00ff00")
        .setTimestamp()
        .setFooter(`Opgevraagd door ${msg.member.displayName}`);

    msg.channel.send(banEmbed).then(async (message) => {
        let emoji = await unbanMessage(message, msg.author, 30, ["✅", "❌"]);

        if (emoji === "✅") {
            msg.guild.members.unban(user).catch(e => msg.reply("Er is iets fout gelopen"));
            msg.channel.send(bannedEmbed);
        } else if (emoji === "❌") {
            msg.reply("Unban geannuleerd");
        }
    });
}

exports.conf = {
    aliases: [],
    permLevel: 1
};

exports.help = {
    name: "unban",
    description: "Unban iemand",
    usage: "unban [@gebruiker]"
}

async function unbanMessage(msg, author, time, reactions) {
    time *= 1000;

    for (const reaction of reactions) {
        await msg.react(reaction);
    }

    const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

    return msg.awaitReactions(filter, { max: 1, time: time }).then(reaction => reaction.first() && reaction.first().emoji.name);
}