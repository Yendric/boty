const Discord = require("discord.js");

exports.run = async (client, msg, params) => {
    client.storage.settings.ensure(msg.guild.id, client.storage.defaultServerSettings);
    let categoryId = client.storage.settings.get(msg.guild.id, "channels.ticket_category");
    if (categoryId == "") return msg.reply('Er is geen ticketcategorie ingesteld. Gebruik ``set channels.ticket_category <id>``');
    let userName = msg.author.username;
    let userDiscriminator = msg.author.discriminator;
    let reason;

    if (params.length === 0)
        return msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Ticket")
            .setDescription("Geef een onderwerp op, zoals hier: !ticket <onderwerp>")
            .setColor("#FF0000")
        );
    reason = params.join(' ');

    msg.guild.channels.cache.forEach(channel => {
        if (channel.name == userName.toLowerCase() + "-" + userDiscriminator) {
            return msg.channel.send(new Discord.MessageEmbed()
                .setTitle("Ticket")
                .setDescription("Je hebt al een ticket gemaakt!")
                .setColor("#FF0000")
            );
        }
    });

    msg.channel.send(new Discord.MessageEmbed()
        .setTitle("Ticket")
        .setDescription("Ticket succesvol aangemaakt!")
        .setColor('#00FF00')
    );

    msg.guild.channels.create(userName + "-" + userDiscriminator, { type: "text" }).then((createdChan) => {
        createdChan.setParent(categoryId).then((settedParent) => {
            settedParent.createOverwrite(msg.guild.roles.cache.find(role => role.name === '@everyone'), { "VIEW_CHANNEL": false });
            settedParent.updateOverwrite(msg.guild.roles.cache.find(role => role.name === 'Moderator'), {
                "VIEW_CHANNEL": true, "SEND_MESSAGES": true,
                "ATTACH_FILES": true, "CONNECT": true,
                "CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true
            });
            settedParent.updateOverwrite(msg.author, {
                "VIEW_CHANNEL": true, "SEND_MESSAGES": true,
                "ATTACH_FILES": true, "CONNECT": true,
                "CREATE_INSTANT_INVITE": false, "ADD_REACTIONS": true
            });
            createdChan.send(new Discord.MessageEmbed()
                .setTitle("Ticket")
                .setDescription(`**Van**: <@${msg.author.id}>\n**Onderwerp**: ${reason}`)
                .setColor('#33AAFF')
            );
        }).catch(err => {
            msg.channel.send(new Discord.MessageEmbed()
                .setTitle("Ticket")
                .setDescription("Er is iets fout gelopen!")
                .setColor("#FF0000")
            );
        });
    }).catch(err => {
        msg.channel.send(new Discord.MessageEmbed()
            .setTitle("Ticket")
            .setDescription("Er is iets fout gelopen!")
            .setColor("#FF0000")
        );
    });
}

exports.conf = {
    aliases: ['new'],
    permLevel: 0
};

exports.help = {
    name: "ticket",
    description: "Maak een ticket.",
    usage: "ticket"
}