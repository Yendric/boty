const Discord = require("discord.js");

exports.run = async (client, msg, args) => {
    if (args.length < 4)
        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Giveaway")
            .setDescription("Geef alle argumenten op, zoals hier: !giveaway <# winnaars> <tijd> <channel> <item>")
            .setColor("#FF0000")
        );
    if (isNaN(args[0]) || isNaN(args[1]))
        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Giveaway")
            .setDescription("Argument 1 en 2 moeten getallen zijn.")
            .setColor("#FF0000")
        );
    if (msg.mentions.channels.array().length === 0)
        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Giveaway")
            .setDescription("Argument 3 moet een geldig channel zijn.")
            .setColor("#FF0000")
        );
    let channel = msg.mentions.channels.array()[0];
    let winnerCount = args[0];
    let time = args[1];
    let item = args.splice(3, args.length).join(' ');

    msg.delete();

    let date = new Date().getTime();
    let dateTime = new Date(date + (time * 1000));

    let giveawayEmbed = new Discord.MessageEmbed()
        .setTitle(`🎉 **GIVEAWAY: ${item}** `)
        .setDescription(`**Aantal winnaars**: ${winnerCount}\n**Tijd resterend**: ${msToTime(dateTime.getTime() - date)}`)
        .setFooter('Eindigt om')
        .setTimestamp(dateTime)
        .setColor("#00FF00");

    function msToTime(duration) {
        const portions = [];
        const msInHour = 1000 * 60 * 60;
        const hours = Math.trunc(duration / msInHour);
        if (hours > 0) {
            portions.push(hours + 'h');
            duration = duration - (hours * msInHour);
        }
        const msInMinute = 1000 * 60;
        const minutes = Math.trunc(duration / msInMinute);
        if (minutes > 0) {
            portions.push(minutes + 'm');
            duration = duration - (minutes * msInMinute);
        }
        const seconds = Math.trunc(duration / 1000);
        if (seconds > 0) {
            portions.push(seconds + 's');
        }
        return portions.join(' ');
    }

    let embedSend = await channel.send(giveawayEmbed);
    embedSend.react("🎉");

    let messageUpdateLoop = setInterval(function () {
        embedSend.edit(new Discord.MessageEmbed()
            .setTitle(`🎉 **GIVEAWAY: ${item}** `)
            .setDescription(`**Aantal winnaars**: ${winnerCount}\n**Tijd resterend**: ${msToTime(dateTime.getTime() - new Date().getTime())}`)
            .setFooter('Eindigt om')
            .setTimestamp(dateTime)
            .setColor("#00FF00"));
    }, 5000);

    setTimeout(async function () {
        let winners = [];
        let peopleReacted = embedSend.reactions.cache.first().users.cache;

        // stop de messageUpdate loop
        clearInterval(messageUpdateLoop);

        peopleReacted = peopleReacted.filter(user => user.id !== client.user.id);

        if (peopleReacted.length < winnerCount) {
            embedSend.edit(new Discord.MessageEmbed()
                .setTitle(`🎉 **GIVEAWAY: ${item}** `)
                .setDescription(`**Winnaars**: niemand heeft gewonnen`)
                .setFooter('Beëindigt om')
                .setTimestamp(dateTime)
                .setColor("#00FF00"));
            return channel.send("Er waren te weinig deelnemers dus niemand heeft gewonnen");
        }

        for (let i = 0; i < winnerCount; i++) {
            let winner = peopleReacted.random();
            winners.push(winner);
            peopleReacted.delete(winner.id);
        }

        embedSend.edit(new Discord.MessageEmbed()
            .setTitle(`🎉 **GIVEAWAY: ${item}** `)
            .setDescription(`**Winnaars**: ${winners.join()}`)
            .setFooter('Beëindigt om')
            .setTimestamp(dateTime)
            .setColor("#00FF00"));
        winners.forEach(winner => {
            channel.send(`Gefeliciteerd ${winner}! Je hebt **${item}** gewonnen.`);
        });
    }, 1000 * time);


}


exports.conf = {
    aliases: [],
    permLevel: 3
};

exports.help = {
    name: "giveaway",
    description: "Start een giveaway.",
    usage: "giveaway"
}