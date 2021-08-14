const Discord = require('discord.js');

exports.run = async (client, msg, args) => {
	if (!msg.guild.me.hasPermission('BAN_MEMBERS')) return msg.reply('Ik heb hier geen toestemming voor :(');
	if (!args[0]) return msg.reply('Geen gebruiker opgegeven');
	if (!args[1]) return msg.reply('Geen reden opgegeven');

	const user = msg.mentions.members.first() || msg.guild.members.get(args[0]);
	const reason = args.slice(1).join(' ');
	if (!user) return msg.reply('Gebruiker niet gevonden.');

	const banEmbed = new Discord.MessageEmbed()
		.setTitle(`${msg.guild.name} | Moderatie`)
		.setDescription(`Wil je ${user} bannen?`)
		.setColor('#00ff00')
		.setFooter(`Opgevraagd door ${msg.member.displayName}`);

	const bannedEmbed = new Discord.MessageEmbed()
		.setTitle(`${msg.guild.name} | Moderatie`)
		.setDescription(`**Gebanned: ${user}**
        **Door:** ${msg.author}
        **Reden:** ${reason}`)
		.setColor('#ff0000')
		.setTimestamp()
		.setFooter(`Opgevraagd door ${msg.member.displayName}`);

	msg.channel.send(banEmbed).then(async (message) => {
		const emoji = await banMessage(message, msg.author, 30, ['✅', '❌']);

		if (emoji === '✅') {
			user.ban(reason).catch(e => msg.reply('Er is iets fout gelopen'));
			msg.channel.send(bannedEmbed);
		}
		else if (emoji === '❌') {
			msg.reply('Ban geannuleerd');
		}
	});
};

exports.conf = {
	aliases: [],
	permLevel: 1,
	args: [
		{
			name: 'gebruiker',
			type: 'user',
		},
		{
			name: 'reden',
		},
	],
};

exports.help = {
	name: 'ban',
	description: 'Ban iemand',
	usage: 'ban [@gebruiker] [reden]',
};

async function banMessage(msg, author, time, reactions) {
	time *= 1000;

	for (const reaction of reactions) {
		await msg.react(reaction);
	}

	const filter = (reaction, user) => reactions.includes(reaction.emoji.name) && user.id === author.id;

	return msg.awaitReactions(filter, { max: 1, time: time }).then(reaction => reaction.first() && reaction.first().emoji.name);
}