const Discord = require("discord.js");

exports.run = async (client, msg, params) => {
    client.storage.settings.ensure(msg.guild.id, client.storage.defaultServerSettings);
    let categoryId = client.storage.settings.get(msg.guild.id, "channels.ticket_category");
    if (categoryId == "") return msg.reply('Er is geen ticketcategorie ingesteld. Gebruik ``set channels.ticket_category <id>``');
    if (msg.channel.parentID !== categoryId)
        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Ticket")
            .setDescription("Gelieve dit commando in een ticket kanaal uit te voeren.")
            .setColor("#FF0000")
        );

    msg.channel.delete();

    msg.author.send(new Discord.MessageEmbed()
        .setTitle("Ticket succesvol gesloten")
        .setDescription(`Je ticket is succesvol afgesloten.`)
        .setColor('#00FF00')
    ).catch(error => console.log(error));
}

exports.conf = {
    aliases: ["closeticket"],
    permLevel: 0
}

exports.help = {
    name: "close",
    description: "Sluit een ticket.",
    usage: "close"
}